import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import calendar from 'dayjs/plugin/calendar'
import relativeTime from 'dayjs/plugin/relativeTime'
import updateLocale from 'dayjs/plugin/updateLocale'
import 'dayjs/locale/es'

// Extender dayjs con los plugins necesarios
dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.extend(calendar)
dayjs.extend(relativeTime)
dayjs.extend(updateLocale)

// Configurar locale en español
dayjs.locale('es')

// Configurar formato de calendario personalizado
dayjs.updateLocale('es', {
  calendar: {
    sameDay: '[Hoy a las] H:mm',
    nextDay: '[Mañana a las] H:mm',
    nextWeek: 'dddd [a las] H:mm',
    lastDay: '[Ayer a las] H:mm',
    lastWeek: '[El] dddd [pasado a las] H:mm',
    sameElse: 'DD/MM/YYYY',
  },
})

export default dayjs
