const RIPPLE_DURATION = 650

export function useRipple() {
  function createRipple(event) {
    const target = event.currentTarget
    if (!target || typeof target.appendChild !== 'function') return
    const rect = target.getBoundingClientRect()
    const size = Math.max(rect.width, rect.height)
    if (size <= 0) return
    const ripple = document.createElement('span')
    ripple.className = 'ripple'
    ripple.style.width = `${size}px`
    ripple.style.height = `${size}px`
    ripple.style.left = `${event.clientX - rect.left - size / 2}px`
    ripple.style.top = `${event.clientY - rect.top - size / 2}px`
    target.appendChild(ripple)
    window.setTimeout(() => ripple.remove(), RIPPLE_DURATION)
  }

  return { createRipple }
}