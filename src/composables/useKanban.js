import { reactive } from 'vue'
import { loadState, saveState, storageKey } from '../utils/storage'

export const STORAGE_KEY = storageKey('state')

function defaultColumns() {
  return [
    { id: 'todo', title: '待办', color: '#5b8def' },
    { id: 'doing', title: '进行中', color: '#f0a24b' },
    { id: 'done', title: '已完成', color: '#4ecb8f' }
  ]
}

const state = reactive({
  columns: defaultColumns(),
  tasks: []
})

let initialized = false

function persist() {
  saveState(STORAGE_KEY, { columns: state.columns, tasks: state.tasks })
}

function ensureInit() {
  if (initialized) return
  initialized = true
  const saved = loadState(STORAGE_KEY)
  if (saved) {
    state.columns = saved.columns
    state.tasks = saved.tasks
  }
}

export function useKanban() {
  ensureInit()

  function tasksByColumn(columnId) {
    return state.tasks.filter((t) => t.columnId === columnId)
  }

  function addTask({ title, description = '', category = '', columnId = 'todo' }) {
    const task = {
      id: `task_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      title,
      description,
      category,
      columnId,
      starred: false,
      urgent: false,
      createdAt: Date.now()
    }
    state.tasks.unshift(task)
    persist()
    return task
  }

  function removeTask(id) {
    const idx = state.tasks.findIndex((t) => t.id === id)
    if (idx !== -1) {
      state.tasks.splice(idx, 1)
      persist()
    }
  }

  function toggleFlag(id, flag) {
    const task = state.tasks.find((t) => t.id === id)
    if (!task) return false
    if (flag !== 'starred' && flag !== 'urgent') return false
    task[flag] = !task[flag]
    persist()
    return task[flag]
  }

  function moveTask(taskId, columnId, index = null) {
    const task = state.tasks.find((t) => t.id === taskId)
    if (!task) return
    if (typeof index !== 'number') {
      task.columnId = columnId
      persist()
      return
    }
    const fromIdx = state.tasks.indexOf(task)
    state.tasks.splice(fromIdx, 1)
    task.columnId = columnId
    const columnTasks = state.tasks.filter((t) => t.columnId === columnId)
    if (index <= 0 || columnTasks.length === 0) {
      state.tasks.unshift(task)
    } else if (index >= columnTasks.length) {
      state.tasks.push(task)
    } else {
      const anchor = columnTasks[index]
      const anchorIdx = state.tasks.indexOf(anchor)
      state.tasks.splice(anchorIdx, 0, task)
    }
    persist()
  }

  function resetBoard() {
    state.tasks = []
    state.columns = defaultColumns()
    persist()
  }

  return { state, tasksByColumn, addTask, removeTask, toggleFlag, moveTask, resetBoard }
}