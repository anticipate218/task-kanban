const MINUTE = 60_000
const HOUR = 3_600_000
const DAY = 86_400_000

function pad(n) {
  return String(n).padStart(2, '0')
}

export function formatDateTime(timestamp) {
  if (!timestamp) return ''
  const d = new Date(timestamp)
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`
}

export function formatRelativeTime(timestamp) {
  if (!timestamp) return ''
  const diff = Date.now() - timestamp
  if (diff < MINUTE) return '刚刚'
  if (diff < HOUR) return `${Math.floor(diff / MINUTE)} 分钟前`
  if (diff < DAY) return `${Math.floor(diff / HOUR)} 小时前`
  if (diff < 7 * DAY) return `${Math.floor(diff / DAY)} 天前`
  return formatDateTime(timestamp)
}