import { ref } from 'vue'
import { themes } from '../config/themes'
import { applyThemeById } from '../utils/cssVariables'

const THEME_KEY = 'task-kanban:theme'

const current = ref('light')

let initialized = false

function ensureInit() {
  if (initialized) return
  initialized = true
  try {
    const saved = localStorage.getItem(THEME_KEY)
    if (saved && themes.some((t) => t.id === saved)) current.value = saved
  } catch {
    /* localStorage 不可用时保持默认 */
  }
  applyThemeById(current.value)
}

export function useTheme() {
  ensureInit()

  function setTheme(id) {
    if (!themes.some((t) => t.id === id)) return
    current.value = id
    try {
      localStorage.setItem(THEME_KEY, id)
    } catch {
      /* 忽略写入失败 */
    }
    applyThemeById(id)
  }

  function previewTheme(id) {
    applyThemeById(id)
  }

  function cancelPreview() {
    applyThemeById(current.value)
  }

  function cycleTheme() {
    const idx = themes.findIndex((t) => t.id === current.value)
    const next = themes[(idx + 1) % themes.length]
    setTheme(next.id)
    return next
  }

  return { current, themes, setTheme, previewTheme, cancelPreview, cycleTheme }
}