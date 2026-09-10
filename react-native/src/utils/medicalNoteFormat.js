const months = [
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
];

export function medicalNoteDate(date) {
  return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
}

export function medicalNoteShortDate(date) {
  return `${months[date.getMonth()].slice(0, 3)} ${date.getDate()}`;
}
