<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useTheme } from '../composables/useTheme'

const { current, themes, setTheme, previewTheme, cancelPreview } = useTheme()

const open = ref(false)
const rootRef = ref(null)

const currentName = computed(() => {
  const t = themes.find((item) => item.id === current.value)
  return t ? t.name : '亮色'
})

function toggleMenu() {
  open.value = !open.value
  if (!open.value) cancelPreview()
}

function selectTheme(id) {
  setTheme(id)
  open.value = false
}

function onDocClick(e) {
  if (rootRef.value && !rootRef.value.contains(e.target)) {
    open.value = false
    cancelPreview()
  }
}

onMounted(() => document.addEventListener('click', onDocClick))
onBeforeUnmount(() => document.removeEventListener('click', onDocClick))
</script>

<template>
  <div ref="rootRef" class="theme-selector">
    <button class="theme-selector__trigger" :title="`切换主题（当前：${currentName}）`" @click="toggleMenu">
      <span class="theme-selector__palette">🎨</span>
      <span class="theme-selector__name">{{ currentName }}</span>
      <span class="theme-selector__arrow" :class="{ 'is-open': open }">▾</span>
    </button>

    <Transition name="dropdown">
      <ul v-if="open" class="theme-selector__menu" @mouseleave="cancelPreview">
        <li
          v-for="t in themes"
          :key="t.id"
          class="theme-selector__item"
          :class="{ 'is-active': t.id === current }"
          @mouseenter="previewTheme(t.id)"
          @click="selectTheme(t.id)"
        >
          <span class="theme-selector__swatch">
            <i v-for="(c, i) in t.swatch" :key="i" :style="{ background: c }"></i>
          </span>
          <span class="theme-selector__meta">
            <span class="theme-selector__label">{{ t.name }}</span>
            <span class="theme-selector__desc">{{ t.description }}</span>
          </span>
          <span v-if="t.id === current" class="theme-selector__check">✓</span>
        </li>
      </ul>
    </Transition>
  </div>
</template>

<style scoped>
.theme-selector {
  position: relative;
}

.theme-selector__trigger {
  display: inline-flex;
  align-items: center;
  gap: var(--space-xs);
  padding: 8px 14px;
  border-radius: var(--radius-sm);
  border: 1px solid var(--border);
  color: var(--text-secondary);
  background: var(--surface);
  transition: all var(--transition-fast);
}

.theme-selector__trigger:hover {
  color: var(--text);
  border-color: var(--text-muted);
}

.theme-selector__arrow {
  font-size: 10px;
  transition: transform var(--transition-fast);
}

.theme-selector__arrow.is-open {
  transform: rotate(180deg);
}

.theme-selector__menu {
  position: absolute;
  top: calc(100% + var(--space-sm));
  right: 0;
  z-index: var(--z-dropdown);
  min-width: 230px;
  padding: var(--space-xs);
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-md);
}

.theme-selector__item {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  padding: 10px var(--space-sm);
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: background var(--transition-fast);
}

.theme-selector__item:hover {
  background: var(--surface-hover);
}

.theme-selector__item.is-active {
  background: var(--primary-soft);
}

.theme-selector__swatch {
  display: inline-flex;
  gap: 3px;
  padding: 3px;
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  background: var(--bg-soft);
}

.theme-selector__swatch i {
  width: 12px;
  height: 12px;
  border-radius: 3px;
  display: inline-block;
}

.theme-selector__meta {
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex: 1;
}

.theme-selector__label {
  font-size: var(--font-size-sm);
  font-weight: 600;
  color: var(--text);
}

.theme-selector__desc {
  font-size: var(--font-size-xs);
  color: var(--text-muted);
}

.theme-selector__check {
  color: var(--primary);
  font-weight: 700;
}
</style>