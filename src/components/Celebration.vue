<script setup>
import { ref, watch, onBeforeUnmount } from 'vue'

const props = defineProps({
  visible: { type: Boolean, default: false },
  effect: { type: String, default: 'mixed' },
  duration: { type: Number, default: 2600 }
})

const emit = defineEmits(['complete'])

const canvasRef = ref(null)
let rafId = null
let particles = []
let endTime = 0

const COLORS = ['#f76c8e', '#f5b840', '#5b8def', '#4ecb8f', '#b45de0', '#4dd0e1']

watch(
  () => props.visible,
  (val) => {
    if (val) start()
    else stop(true)
  }
)

onBeforeUnmount(() => stop(true))

function stop(silent) {
  if (rafId) cancelAnimationFrame(rafId)
  rafId = null
  particles = []
  const canvas = canvasRef.value
  if (silent && canvas) {
    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, canvas.width, canvas.height)
  }
}

function start() {
  const canvas = canvasRef.value
  if (!canvas) return
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
  const ctx = canvas.getContext('2d')
  particles = spawnParticles()
  endTime = performance.now() + props.duration
  if (rafId) cancelAnimationFrame(rafId)

  const tick = (now) => {
    if (now >= endTime) {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      rafId = null
      emit('complete')
      return
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    particles.forEach((p) => {
      updateParticle(p, now)
      drawParticle(ctx, p)
    })
    rafId = requestAnimationFrame(tick)
  }
  rafId = requestAnimationFrame(tick)
}

function pickKind() {
  if (props.effect === 'confetti') return 'confetti'
  if (props.effect === 'stars') return 'star'
  if (props.effect === 'hearts') return 'heart'
  const pool = ['confetti', 'confetti', 'confetti', 'star', 'heart']
  return pool[Math.floor(Math.random() * pool.length)]
}

function spawnParticles() {
  const list = []
  const count = 100
  const width = window.innerWidth
  for (let i = 0; i < count; i++) {
    list.push({
      kind: pickKind(),
      x: Math.random() * width,
      y: -30 - Math.random() * 160,
      vx: (Math.random() - 0.5) * 3,
      vy: 2.2 + Math.random() * 3,
      size: 7 + Math.random() * 8,
      rotation: Math.random() * Math.PI * 2,
      vr: (Math.random() - 0.5) * 0.25,
      color: COLORS[i % COLORS.length],
      alpha: 1,
      sway: Math.random() * Math.PI * 2,
      swaySpeed: 0.05 + Math.random() * 0.05
    })
  }
  return list
}

function updateParticle(p, now) {
  p.sway += p.swaySpeed
  p.x += p.vx + Math.sin(p.sway) * 1.2
  p.y += p.vy
  p.vy += 0.04
  p.rotation += p.vr
  const remain = endTime - now
  if (remain < 600) {
    p.alpha = Math.max(0, remain / 600)
  }
}

function drawParticle(ctx, p) {
  ctx.save()
  ctx.globalAlpha = p.alpha
  ctx.translate(p.x, p.y)
  ctx.rotate(p.rotation)
  ctx.fillStyle = p.color
  if (p.kind === 'confetti') {
    ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2)
  } else if (p.kind === 'star') {
    drawStar(ctx, p.size / 2)
  } else {
    drawHeart(ctx, p.size / 2)
  }
  ctx.restore()
}

function drawStar(ctx, r) {
  ctx.beginPath()
  for (let i = 0; i < 5; i++) {
    const outer = (i * 2 * Math.PI) / 5 - Math.PI / 2
    const inner = outer + Math.PI / 5
    ctx.lineTo(Math.cos(outer) * r, Math.sin(outer) * r)
    ctx.lineTo(Math.cos(inner) * (r / 2.4), Math.sin(inner) * (r / 2.4))
  }
  ctx.closePath()
  ctx.fill()
}

function drawHeart(ctx, r) {
  ctx.beginPath()
  ctx.moveTo(0, r * 0.35)
  ctx.bezierCurveTo(-r, -r * 0.45, -r * 0.4, -r * 1.1, 0, -r * 0.35)
  ctx.bezierCurveTo(r * 0.4, -r * 1.1, r, -r * 0.45, 0, r * 0.35)
  ctx.closePath()
  ctx.fill()
}
</script>

<template>
  <canvas v-show="visible" ref="canvasRef" class="celebration-canvas"></canvas>
</template>

<style scoped>
.celebration-canvas {
  position: fixed;
  inset: 0;
  z-index: var(--z-celebration);
  pointer-events: none;
}
</style>