const STORAGE_PREFIX = 'task-kanban'

export function storageKey(name) {
  return `${STORAGE_PREFIX}:${name}`
}

export function loadState(key) {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return null
    const data = JSON.parse(raw)
    if (!data || typeof data !== 'object' || Array.isArray(data)) return null
    if (!Array.isArray(data.tasks) || !Array.isArray(data.columns)) return null
    return data
  } catch {
    return null
  }
}

export function saveState(key, state) {
  try {
    localStorage.setItem(key, JSON.stringify(state))
    return true
  } catch {
    return false
  }
}

export function clearState(key) {
  try {
    localStorage.removeItem(key)
    return true
  } catch {
    return false
  }
}