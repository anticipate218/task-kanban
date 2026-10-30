<script setup>
import { ref } from 'vue'
import TaskCard from './TaskCard.vue'
import EmptyState from './EmptyState.vue'

const props = defineProps({
  column: { type: Object, required: true },
  taskList: { type: Array, default: () => [] },
  showAddAction: { type: Boolean, default: false }
})

const emit = defineEmits(['move', 'toggle', 'remove', 'add'])

const isDragOver = ref(false)

function onDragOver(e) {
  e.preventDefault()
  e.dataTransfer.dropEffect = 'move'
  isDragOver.value = true
}

function onDragLeave(e) {
  if (!e.currentTarget.contains(e.relatedTarget)) {
    isDragOver.value = false
  }
}

function onDrop(e) {
  e.preventDefault()
  isDragOver.value = false
  const taskId = e.dataTransfer.getData('text/plain')
  if (taskId) {
    emit('move', taskId, props.column.id, null)
  }
}

function emptyIcon() {
  if (props.column.id === 'done') return '🎯'
  if (props.column.id === 'doing') return '⚡'
  return '📝'
}
</script>

<template>
  <section
    class="kanban-column"
    :class="{ 'is-drag-over': isDragOver }"
    :data-column-id="column.id"
    :aria-label="`${column.title}列`"
    @dragover="onDragOver"
    @dragleave="onDragLeave"
    @drop="onDrop"
  >
    <header class="kanban-column__header">
      <span class="kanban-column__dot" :style="{ background: column.color }"></span>
      <h3 class="kanban-column__title">{{ column.title }}</h3>
      <span class="kanban-column__count">{{ taskList.length }}</span>
    </header>

    <div class="kanban-column__body">
      <TransitionGroup name="card" tag="div" class="kanban-column__cards">
        <TaskCard
          v-for="task in taskList"
          :key="task.id"
          :task="task"
          @toggle="(id, flag) => emit('toggle', id, flag)"
          @remove="(id) => emit('remove', id)"
        />
      </TransitionGroup>

      <EmptyState
        v-if="taskList.length === 0"
        :icon="emptyIcon()"
        :title="showAddAction ? '还没有任务' : '暂无任务'"
        :hint="showAddAction ? '点击下方按钮创建第一个任务' : '把任务卡片拖拽到这里'"
        :action-text="showAddAction ? '新增任务' : ''"
        action-icon="＋"
        @action="emit('add')"
      />
    </div>
  </section>
</template>

<style scoped>
.kanban-column {
  display: flex;
  flex-direction: column;
  min-height: 340px;
  background: var(--bg-soft);
  border: 2px dashed transparent;
  border-radius: var(--radius-lg);
  padding: var(--space-md);
  transition: background var(--transition-base), border-color var(--transition-base);
}

.kanban-column.is-drag-over {
  border-color: var(--primary);
  background: var(--primary-soft);
}

.kanban-column__header {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  padding: var(--space-xs) var(--space-xs) var(--space-md);
}

.kanban-column__dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  flex-shrink: 0;
}

.kanban-column__title {
  font-size: var(--font-size-md);
  font-weight: 700;
}

.kanban-column__count {
  margin-left: auto;
  min-width: 26px;
  height: 24px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0 8px;
  border-radius: 999px;
  background: var(--surface);
  border: 1px solid var(--border);
  font-size: var(--font-size-xs);
  font-weight: 600;
  color: var(--text-secondary);
}

.kanban-column__body {
  flex: 1;
  display: flex;
  flex-direction: column;
  position: relative;
}

.kanban-column__cards {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}
</style>