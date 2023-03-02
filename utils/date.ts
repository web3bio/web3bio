import formatDateTime from 'date-fns/format'
const ONE_MIN = 60 * 1000
const ONE_HOUR = 60 * ONE_MIN
const ONE_DAY = 24 * ONE_HOUR
const ONE_WEEK = 7 * ONE_DAY

const plural = (num: number, unit: string) => `${num} ${unit}${num !== 1 ? 's' : ''}`

/**
 * A datetime formatter follows RSS3's
 */
 export function formatTimestamp(timestamp: string): string {
    const date = new Date(timestamp)
    const ms = date.getTime()
    const distance = Date.now() - ms
    if (distance > ONE_WEEK) {
        return formatDateTime(date, 'MM/dd/yyyy')
    }
    if (distance > ONE_DAY) {
        const days = Math.floor(distance / ONE_DAY)
        return plural(days, 'day')
    }
    if (distance > ONE_HOUR) {
        const hours = Math.floor(distance / ONE_HOUR)
        return plural(hours, 'hr')
    }
    const mins = Math.floor(distance / ONE_MIN)
    return plural(mins, 'min')
}