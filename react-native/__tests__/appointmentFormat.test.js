import {
  appointmentBadge,
  appointmentDetailDate,
  appointmentTime,
} from '../src/utils/appointmentFormat';

describe('appointment formatting', () => {
  test('formats midnight, noon, and padded minutes correctly', () => {
    expect(appointmentTime(new Date(2026, 0, 1, 0, 5))).toBe('12:05 AM');
    expect(appointmentTime(new Date(2026, 0, 1, 12))).toBe('12:00 PM');
  });

  test('formats badge and detail labels', () => {
    const date = new Date(2026, 8, 4, 10, 30);
    expect(appointmentBadge(date)).toBe('SEP 4');
    expect(appointmentDetailDate(date)).toBe('Friday, Sep 4 • 10:30 AM');
  });
});
