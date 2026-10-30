import { themes } from '../config/themes'

export function applyThemeById(themeId) {
  const theme = themes.find((t) => t.id === themeId)
  if (!theme) return false
  applyTheme(theme)
  return true
}

export function applyTheme(theme) {
  if (!theme || !theme.colors) return
  const root = document.documentElement
  Object.entries(theme.colors).forEach(([key, value]) => {
    root.style.setProperty(`--${key}`, value)
  })
}

export function getCssVariable(name) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim()
}