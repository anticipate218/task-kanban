import { reactive } from 'vue'

const toasts = reactive([])
let seed = 0
const timers = new Map()

export function useToast() {
  function show(message, type = 'info', duration = 3200) {
    const id = ++seed
    toasts.push({ id, message, type, duration })
    timers.set(id, window.setTimeout(() => remove(id), duration))
    return id
  }

  function remove(id) {
    const idx = toasts.findIndex((t) => t.id === id)
    if (idx !== -1) toasts.splice(idx, 1)
    const timer = timers.get(id)
    if (timer) {
      window.clearTimeout(timer)
      timers.delete(id)
    }
  }

  function pause(id) {
    const timer = timers.get(id)
    if (timer) {
      window.clearTimeout(timer)
      timers.delete(id)
    }
  }

  function resume(id) {
    const toast = toasts.find((t) => t.id === id)
    if (toast && !timers.has(id)) {
      timers.set(id, window.setTimeout(() => remove(id), toast.duration))
    }
  }

  function clear() {
    ;[...toasts].forEach((t) => remove(t.id))
  }

  function success(message) {
    return show(message, 'success')
  }

  function error(message) {
    return show(message, 'error')
  }

  return { toasts, show, remove, pause, resume, clear, success, error }
}