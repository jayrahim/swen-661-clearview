import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:clearview_flutter/screens/messages_screen.dart';

void main() {
  Widget buildScreen() {
    return const ProviderScope(
      child: MaterialApp(
        home: MessagesScreen(),
      ),
    );
  }

testWidgets(
  'messages screen displays message list and unread count',
  (tester) async {
    await tester.pumpWidget(buildScreen());

    expect(find.text('Messages'), findsNWidgets(2));
    expect(find.text('2 unread'), findsOneWidget);

    expect(find.text('Dr. David Chen'), findsOneWidget);
    expect(find.text('Care Team'), findsOneWidget);

    expect(
      find.text('Your lab results are available'),
      findsOneWidget,
    );
    expect(
      find.text('Reminder: upcoming appointment'),
      findsOneWidget,
    );

    await tester.scrollUntilVisible(
      find.text('Billing Support'),
      300,
      scrollable: find.byType(Scrollable).first,
    );

    await tester.pumpAndSettle();

    expect(find.text('Vision Center'), findsOneWidget);
    expect(find.text('Billing Support'), findsOneWidget);

    expect(
      find.text('Referral received'),
      findsOneWidget,
    );
    expect(
      find.text('Statement available'),
      findsOneWidget,
    );
  },
);

  testWidgets('tapping a message opens message detail', (tester) async {
    await tester.pumpWidget(buildScreen());

    await tester.tap(find.text('Dr. David Chen'));
    await tester.pumpAndSettle();

    expect(find.text('Message'), findsOneWidget);
    expect(find.text('Dr. David Chen'), findsOneWidget);
    expect(
      find.text('Your lab results are available'),
      findsOneWidget,
    );
    expect(find.text('View lab results'), findsOneWidget);
    expect(find.text('Reply'), findsOneWidget);
  });

  testWidgets('messages screen displays bottom navigation', (tester) async {
  await tester.pumpWidget(buildScreen());

  expect(find.text('Home'), findsOneWidget);
  expect(find.text('Visits'), findsOneWidget);
  expect(find.text('Messages'), findsWidgets);
  expect(find.text('Records'), findsOneWidget);
  expect(find.text('Settings'), findsOneWidget);
});

  testWidgets('messages screen supports enlarged text', (tester) async {
    await tester.pumpWidget(
      const ProviderScope(
        child: MaterialApp(
          home: MediaQuery(
            data: MediaQueryData(
              textScaler: TextScaler.linear(2.0),
            ),
            child: MessagesScreen(),
          ),
        ),
      ),
    );

    await tester.pumpAndSettle();

    expect(find.text('Messages'), findsWidgets);
    expect(find.text('2 unread'), findsOneWidget);
    expect(find.text('Dr. David Chen'), findsOneWidget);

    expect(tester.takeException(), isNull);
  });
}