import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

export function useTime() {
  dayjs.extend(relativeTime)

  return dayjs
}
