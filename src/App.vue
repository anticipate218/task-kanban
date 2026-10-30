<script setup>
import { ref, computed } from 'vue'
import NavBar from './components/NavBar.vue'
import KanbanColumn from './components/KanbanColumn.vue'
import AddTaskModal from './components/AddTaskModal.vue'
import FunToast from './components/FunToast.vue'
import Celebration from './components/Celebration.vue'
import { useKanban } from './composables/useKanban'
import { useToast } from './composables/useToast'
import { useTheme } from './composables/useTheme'
import { getRandomMessage } from './config/toastMessages'

const { state, tasksByColumn, addTask, removeTask, toggleFlag, moveTask, resetBoard } = useKanban()
const { show } = useToast()
useTheme()

const modalVisible = ref(false)
const celebrationVisible = ref(false)

const existingCategories = computed(() => {
  const set = new Set()
  state.tasks.forEach((t) => {
    if (t.category) set.add(t.category)
  })
  return [...set]
})

function openModal() {
  modalVisible.value = true
}

function handleSubmit(task) {
  addTask(task)
  show(getRandomMessage('add'), 'success')
  modalVisible.value = false
}

function handleMove(taskId, columnId, index) {
  const task = state.tasks.find((t) => t.id === taskId)
  const from = task ? task.columnId : null
  moveTask(taskId, columnId, index)
  if (columnId === 'done' && from !== 'done') {
    celebrationVisible.value = true
    show(getRandomMessage('complete'), 'success')
  } else {
    show(getRandomMessage('move'), 'info')
  }
}

function handleToggle(id, flag) {
  const task = state.tasks.find((t) => t.id === id)
  const willOn = task ? !task[flag] : true
  toggleFlag(id, flag)
  if (flag === 'starred') {
    show(getRandomMessage(willOn ? 'star' : 'unstar'), 'success')
  } else {
    show(getRandomMessage(willOn ? 'urgent' : 'unurgent'), 'info')
  }
}

function handleRemove(id) {
  removeTask(id)
  show(getRandomMessage('remove'), 'info')
}

function handleReset() {
  if (window.confirm('确定要清空看板上的所有任务吗？此操作不可恢复。')) {
    resetBoard()
    show(getRandomMessage('reset'), 'info')
  }
}

function handleCelebrationComplete() {
  celebrationVisible.value = false
}
</script>

<template>
  <div class="app">
    <NavBar :tasks="state.tasks" @add-task="openModal" @reset="handleReset" />

    <main class="board">
      <KanbanColumn
        v-for="col in state.columns"
        :key="col.id"
        :column="col"
        :task-list="tasksByColumn(col.id)"
        :show-add-action="col.id === 'todo'"
        @move="handleMove"
        @toggle="handleToggle"
        @remove="handleRemove"
        @add="openModal"
      />
    </main>

    <AddTaskModal
      v-if="modalVisible"
      :columns="state.columns"
      :existing-categories="existingCategories"
      @submit="handleSubmit"
      @close="modalVisible = false"
    />

    <FunToast />

    <Celebration
      :visible="celebrationVisible"
      effect="mixed"
      :duration="2600"
      @complete="handleCelebrationComplete"
    />
  </div>
</template>

<style scoped>
.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.board {
  flex: 1;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-lg);
  width: 100%;
  max-width: 1280px;
  margin: 0 auto;
  padding: var(--space-lg);
  align-items: start;
}

@media (max-width: 900px) {
  .board {
    grid-template-columns: 1fr;
    max-width: 560px;
  }
}
</style>