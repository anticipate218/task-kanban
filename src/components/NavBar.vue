<script setup>
import { computed } from 'vue'
import ThemeSelector from './ThemeSelector.vue'
import { useRipple } from '../composables/useRipple'

const props = defineProps({
  tasks: { type: Array, default: () => [] }
})

defineEmits(['add-task', 'reset'])

const { createRipple } = useRipple()

const totalCount = computed(() => props.tasks.length)
const starredCount = computed(() => props.tasks.filter((t) => t.starred).length)
const doneCount = computed(() => props.tasks.filter((t) => t.columnId === 'done').length)
</script>

<template>
  <header class="navbar">
    <div class="navbar__brand">
      <span class="navbar__logo">📋</span>
      <div class="navbar__titles">
        <h1 class="navbar__title">任务看板</h1>
        <p class="navbar__subtitle">Task Kanban · 高效搞定每一件事</p>
      </div>
    </div>

    <div class="navbar__stats">
      <span class="stat" title="任务总数">
        总计 <b>{{ totalCount }}</b>
      </span>
      <span class="stat stat--star" title="星标任务数">
        ★ <b>{{ starredCount }}</b>
      </span>
      <span class="stat stat--done" title="已完成任务数">
        ✓ <b>{{ doneCount }}</b>
      </span>
    </div>

    <div class="navbar__actions">
      <ThemeSelector />
      <button
        class="btn btn-primary"
        title="新增任务"
        @click="(e) => { createRipple(e); $emit('add-task') }"
      >＋ 新增任务</button>
      <button
        class="btn btn-ghost"
        title="清空所有任务"
        @click="(e) => { createRipple(e); $emit('reset') }"
      >重置看板</button>
    </div>
  </header>
</template>

<style scoped>
.navbar {
  position: sticky;
  top: 0;
  z-index: var(--z-navbar);
  display: flex;
  align-items: center;
  gap: var(--space-lg);
  padding: var(--space-md) var(--space-lg);
  background: var(--surface);
  border-bottom: 1px solid var(--border);
  box-shadow: var(--shadow-sm);
  flex-wrap: wrap;
}

.navbar__brand {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
}

.navbar__logo {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 42px;
  height: 42px;
  font-size: 22px;
  border-radius: var(--radius-md);
  background: var(--primary-soft);
}

.navbar__titles {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.navbar__title {
  font-size: var(--font-size-lg);
  font-weight: 800;
  line-height: 1.2;
}

.navbar__subtitle {
  font-size: var(--font-size-xs);
  color: var(--text-muted);
}

.navbar__stats {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  margin-left: auto;
}

.stat {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 12px;
  border-radius: 999px;
  background: var(--bg-soft);
  border: 1px solid var(--border);
  font-size: var(--font-size-xs);
  color: var(--text-secondary);
}

.stat b {
  font-weight: 700;
  color: var(--text);
}

.stat--star {
  color: var(--star);
}

.stat--star b {
  color: var(--star);
}

.stat--done {
  color: var(--success);
}

.stat--done b {
  color: var(--success);
}

.navbar__actions {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  flex-wrap: wrap;
}

@media (max-width: 900px) {
  .navbar {
    gap: var(--space-md);
  }

  .navbar__stats {
    margin-left: 0;
  }
}

@media (max-width: 600px) {
  .navbar {
    padding: var(--space-md);
  }

  .navbar__subtitle {
    display: none;
  }
}
</style>