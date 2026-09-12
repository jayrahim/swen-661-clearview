import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:clearview_flutter/screens/dashboard_screen.dart';
import 'package:clearview_flutter/screens/messages_screen.dart';

void main() {
  testWidgets('Quick Access Messages opens Messages screen', (tester) async {
    await tester.pumpWidget(
      const ProviderScope(child: MaterialApp(home: DashboardScreen())),
    );

    await tester.pumpAndSettle();

    final quickAccessMessages = find.text('Messages').first;

    await tester.ensureVisible(quickAccessMessages);
    await tester.tap(quickAccessMessages);
    await tester.pumpAndSettle();

    expect(find.byType(MessagesScreen), findsOneWidget);
    expect(find.text('2 unread'), findsOneWidget);
  });

  testWidgets('unavailable Quick Access tiles show prototype feedback', (
    tester,
  ) async {
    await tester.pumpWidget(
      const ProviderScope(child: MaterialApp(home: DashboardScreen())),
    );

    final prescriptions = find.text('Prescriptions');
    await tester.ensureVisible(prescriptions);
    await tester.tap(prescriptions);
    await tester.pump();
    expect(
      find.text('Prescriptions are not available in this prototype.'),
      findsOneWidget,
    );

    final referrals = find.text('Referrals');
    await tester.ensureVisible(referrals);
    await tester.tap(referrals);
    await tester.pump();
    expect(
      find.text('Referrals are not available in this prototype.'),
      findsOneWidget,
    );
    expect(find.byType(DashboardScreen), findsOneWidget);
  });
}
