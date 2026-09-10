import { monthName, shortMonthName } from '../src/utils/dateFormat';

describe('dateFormat', () => {
  test('formats the first and last month indexes', () => {
    expect(monthName(new Date(2026, 0, 1))).toBe('January');
    expect(shortMonthName(new Date(2026, 0, 1))).toBe('Jan');
    expect(monthName(new Date(2026, 11, 1))).toBe('December');
    expect(shortMonthName(new Date(2026, 11, 1))).toBe('Dec');
  });
});
