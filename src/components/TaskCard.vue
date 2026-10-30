<script setup>
import { formatRelativeTime } from '../utils/timeFormat'

const props = defineProps({
  task: { type: Object, required: true }
})

defineEmits(['toggle', 'remove'])

function onDragStart(e) {
  e.dataTransfer.effectAllowed = 'move'
  e.dataTransfer.setData('text/plain', props.task.id)
}
</script>

<template>
  <article
    class="task-card"
    :class="{
      'is-starred': task.starred,
      'is-urgent': task.urgent,
      'is-done': task.columnId === 'done'
    }"
    draggable="true"
    @dragstart="onDragStart"
  >
    <header class="task-card__header">
      <span v-if="task.category" class="task-card__category">{{ task.category }}</span>
      <div class="task-card__actions">
        <button
          class="icon-btn icon-btn--star"
          :class="{ 'is-active': task.starred }"
          :title="task.starred ? '取消星标' : '添加星标'"
          :aria-label="task.starred ? '取消星标' : '添加星标'"
          @click="$emit('toggle', task.id, 'starred')"
        >{{ task.starred ? '★' : '☆' }}</button>
        <button
          class="icon-btn icon-btn--urgent"
          :class="{ 'is-active': task.urgent }"
          :title="task.urgent ? '取消紧急' : '标记紧急'"
          :aria-label="task.urgent ? '取消紧急' : '标记紧急'"
          @click="$emit('toggle', task.id, 'urgent')"
        >!</button>
        <button
          class="icon-btn icon-btn--remove"
          title="删除任务"
          aria-label="删除任务"
          @click="$emit('remove', task.id)"
        >✕</button>
      </div>
    </header>

    <h4 class="task-card__title">{{ task.title }}</h4>
    <p v-if="task.description" class="task-card__desc">{{ task.description }}</p>

    <footer class="task-card__footer">
      <time class="task-card__time" :datetime="String(task.createdAt)">{{ formatRelativeTime(task.createdAt) }}</time>
    </footer>
  </article>
</template>

<style scoped>
.task-card {
  position: relative;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  padding: var(--space-md);
  cursor: grab;
  box-shadow: var(--shadow-sm);
  transition: transform var(--transition-fast), box-shadow var(--transition-fast),
    border-color var(--transition-fast), background var(--transition-base);
  animation: float-up 0.3s ease;
}

.task-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.task-card:active {
  cursor: grabbing;
}

.task-card.is-starred {
  border-color: var(--star);
  background: linear-gradient(135deg, var(--surface) 78%, var(--primary-soft));
}

.task-card.is-urgent {
  border-color: var(--urgent);
  border-width: 2px;
  box-shadow: 0 0 0 3px var(--primary-soft), var(--shadow-sm);
}

.task-card.is-done .task-card__title {
  text-decoration: line-through;
  color: var(--text-muted);
}

.task-card__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-sm);
  margin-bottom: var(--space-sm);
  min-height: 26px;
}

.task-card__category {
  display: inline-flex;
  align-items: center;
  padding: 2px 10px;
  border-radius: 999px;
  background: var(--primary-soft);
  color: var(--primary);
  font-size: var(--font-size-xs);
  font-weight: 600;
  max-width: 60%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.task-card__actions {
  display: inline-flex;
  gap: 2px;
}

.icon-btn--star:hover,
.icon-btn--star.is-active {
  color: var(--star);
}

.icon-btn--urgent {
  font-weight: 800;
}

.icon-btn--urgent:hover,
.icon-btn--urgent.is-active {
  color: var(--urgent);
}

.icon-btn--remove:hover {
  color: var(--danger);
}

.task-card__title {
  font-size: var(--font-size-md);
  font-weight: 700;
  line-height: 1.4;
  word-break: break-word;
}

.task-card__desc {
  margin-top: var(--space-xs);
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.task-card__footer {
  margin-top: var(--space-sm);
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

.task-card__time {
  font-size: var(--font-size-xs);
  color: var(--text-muted);
}
</style>