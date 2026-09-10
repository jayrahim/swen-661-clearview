const months = Object.freeze([
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]);

export function monthName(date) {
  return months[date.getMonth()];
}

export function shortMonthName(date) {
  return monthName(date).slice(0, 3);
}
