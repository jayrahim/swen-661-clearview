import { shortMonthName } from './dateFormat';

const weekdays = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];
export function appointmentTime(date) {
  const hour = date.getHours();
  return `${hour % 12 || 12}:${String(date.getMinutes()).padStart(2, '0')} ${hour >= 12 ? 'PM' : 'AM'}`;
}
export function appointmentBadge(date) {
  return `${shortMonthName(date).toUpperCase()} ${date.getDate()}`;
}
export function appointmentDetailDate(date) {
  return `${weekdays[date.getDay()]}, ${shortMonthName(date)} ${date.getDate()} • ${appointmentTime(date)}`;
}
