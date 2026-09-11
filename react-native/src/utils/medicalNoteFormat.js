import { monthName, shortMonthName } from './dateFormat';

export function medicalNoteDate(date) {
  return `${monthName(date)} ${date.getDate()}, ${date.getFullYear()}`;
}

export function medicalNoteShortDate(date) {
  return `${shortMonthName(date)} ${date.getDate()}`;
}
