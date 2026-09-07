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
}
