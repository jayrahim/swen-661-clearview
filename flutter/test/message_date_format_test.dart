import 'package:flutter_test/flutter_test.dart';

import 'package:clearview_flutter/utils/message_date_format.dart';

void main() {
  final now = DateTime(2026, 8, 27, 12);

  test('formats a message sent today', () {
    final sentAt = DateTime(2026, 8, 27, 8, 42);

    expect(formatMessageDate(sentAt, now: now), 'Today • 8:42 AM');
  });

  test('formats a message sent yesterday', () {
    final sentAt = DateTime(2026, 8, 26, 16, 10);

    expect(formatMessageDate(sentAt, now: now), 'Yesterday • 4:10 PM');
  });

  test('formats an older message with month and day', () {
    final sentAt = DateTime(2026, 8, 24, 11, 18);

    expect(formatMessageDate(sentAt, now: now), 'Aug 24 • 11:18 AM');
  });
}
