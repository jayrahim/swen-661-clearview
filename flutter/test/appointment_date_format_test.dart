import 'package:flutter_test/flutter_test.dart';

import 'package:clearview_flutter/utils/appointment_date_format.dart';

void main() {
  test('appointment time label formats midnight, noon, and padded minutes', () {
    expect(appointmentTimeLabel(DateTime(2026, 1, 1)), '12:00 AM');
    expect(appointmentTimeLabel(DateTime(2026, 1, 1, 12)), '12:00 PM');
    expect(appointmentTimeLabel(DateTime(2026, 1, 1, 14, 5)), '2:05 PM');
  });

  test(
    'appointment date labels use the expected abbreviated and detailed forms',
    () {
      final appointment = DateTime(2026, 9, 4, 10, 30);

      expect(appointmentBadgeLabel(appointment), 'SEP 4');
      expect(appointmentAccessibilityLabel(appointment), 'SEP 4 at 10:30 AM');
      expect(
        appointmentDetailLabel(appointment),
        'Friday, September 4 • 10:30 AM',
      );
    },
  );
}
