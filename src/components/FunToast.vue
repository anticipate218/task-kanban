<script setup>
import { useToast } from '../composables/useToast'

const { toasts, remove, pause, resume } = useToast()

function iconFor(type) {
  if (type === 'success') return '✓'
  if (type === 'error') return '✕'
  return '💡'
}
</script>

<template>
  <div class="toast-container" aria-live="polite">
    <TransitionGroup name="toast">
      <div
        v-for="t in toasts"
        :key="t.id"
        class="toast"
        :class="`toast--${t.type}`"
        @mouseenter="pause(t.id)"
        @mouseleave="resume(t.id)"
      >
        <span class="toast__icon">{{ iconFor(t.type) }}</span>
        <span class="toast__msg">{{ t.message }}</span>
        <button class="toast__close" title="关闭提示" @click="remove(t.id)">✕</button>
        <span class="toast__progress" :style="{ animationDuration: `${t.duration}ms` }"></span>
      </div>
    </TransitionGroup>
  </div>
</template>

<style scoped>
.toast-container {
  position: fixed;
  top: var(--space-lg);
  right: var(--space-lg);
  z-index: var(--z-toast);
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
  pointer-events: none;
}

.toast {
  position: relative;
  pointer-events: auto;
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  min-width: 240px;
  max-width: 340px;
  padding: 12px 34px 12px 14px;
  border-radius: var(--radius-md);
  background: var(--surface);
  color: var(--text);
  box-shadow: var(--shadow-md);
  border-left: 4px solid var(--primary);
  overflow: hidden;
}

.toast--success {
  border-left-color: var(--success);
}

.toast--success .toast__icon {
  color: var(--success);
}

.toast--error {
  border-left-color: var(--danger);
}

.toast--error .toast__icon {
  color: var(--danger);
}

.toast__icon {
  font-size: var(--font-size-sm);
  font-weight: 700;
}

.toast__msg {
  flex: 1;
  font-size: var(--font-size-sm);
  line-height: 1.5;
}

.toast__close {
  position: absolute;
  top: 6px;
  right: 8px;
  font-size: var(--font-size-xs);
  color: var(--text-muted);
  opacity: 0.6;
  transition: opacity var(--transition-fast);
}

.toast__close:hover {
  opacity: 1;
}

.toast__progress {
  position: absolute;
  left: 0;
  bottom: 0;
  height: 3px;
  width: 100%;
  background: var(--primary);
  opacity: 0.7;
  transform-origin: left;
  animation: toast-progress linear forwards;
}

.toast--success .toast__progress {
  background: var(--success);
}

.toast--error .toast__progress {
  background: var(--danger);
}

.toast:hover .toast__progress {
  animation-play-state: paused;
}

@keyframes toast-progress {
  from { transform: scaleX(1); }
  to { transform: scaleX(0); }
}
</style>