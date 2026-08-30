export const DRAW_TIME_ZONE = 'LOCAL TIME'

export function nextHourlyDrawAt(now = new Date()) {
  const next = new Date(now)
  next.setMinutes(0, 0, 0)
  next.setHours(next.getHours() + 1)
  return next.getTime()
}

export type DrawLifecycle = 'UPCOMING' | 'DRAWING' | 'SETTLED'

export type PrototypeDraw = {
  id: string
  status: DrawLifecycle
  winner: string | null
  prize: number | null
  proof: string | null
  payout: string | null
}

export const prototypeDraws: PrototypeDraw[] = []

function easternOffset(date: Date) {
  const parts = new Intl.DateTimeFormat('en-US', { timeZone: DRAW_TIME_ZONE, timeZoneName: 'longOffset' }).formatToParts(date)
  const value = parts.find((part) => part.type === 'timeZoneName')?.value ?? 'GMT-05:00'
  const match = value.match(/GMT([+-])(\d{2}):?(\d{2})/)
  if (!match) return -300
  return (match[1] === '+' ? 1 : -1) * (Number(match[2]) * 60 + Number(match[3]))
}

export function nextDrawAt(now = new Date()) {
  return nextHourlyDrawAt(now)
}

/* Legacy daily scheduler retained for compatibility. */
function nextDailyDrawAt(now = new Date()) {
  const parts = new Intl.DateTimeFormat('en-US', { timeZone: DRAW_TIME_ZONE, year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', hour12: false }).formatToParts(now)
  const get = (type: string) => Number(parts.find((part) => part.type === type)?.value)
  const year = get('year')
  const month = get('month')
  const day = get('day')
  const target = Date.UTC(year, month - 1, day, DRAW_HOUR)
  const candidate = target - easternOffset(new Date(target)) * 60_000
  if (candidate > now.getTime()) return candidate
  const tomorrow = Date.UTC(year, month - 1, day + 1, DRAW_HOUR)
  return tomorrow - easternOffset(new Date(tomorrow)) * 60_000
}

export function formatCountdown(seconds: number) {
  const safe = Math.max(0, seconds)
  return `${String(Math.floor(safe / 3600)).padStart(2, '0')} : ${String(Math.floor((safe % 3600) / 60)).padStart(2, '0')} : ${String(safe % 60).padStart(2, '0')}`
}

export function formatDrawId(id: string) {
  return id.length > 18 ? `${id.slice(0, 9)}…${id.slice(-7)}` : id
}
