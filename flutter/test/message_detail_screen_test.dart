import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:clearview_flutter/models/message.dart';
import 'package:clearview_flutter/screens/message_detail_screen.dart';

void main() {
  final testMessage = Message(
    id: 'msg-1',
    sender: 'Dr. David Chen',
    subject: 'Your lab results are available',
    preview: 'Your recent blood work is now available in CareConnect.',
    sentAt: DateTime(2026, 8, 27, 8, 42),
    isRead: false,
    body:
        'Hi Maya,\n\n'
        'Your recent blood work is now available in CareConnect. '
        'Most results are within the expected range. I added a note '
        'about your vitamin D level and would like you to review it '
        'before our next visit.',
    statusMessage: '✓ Results reviewed by care team',
    statusDetail: 'No urgent follow-up is required.',
  );

  Widget buildScreen() {
    return MaterialApp(
      home: MessageDetailScreen(
        message: testMessage,
      ),
    );
  }

  testWidgets(
    'message detail displays selected message information',
    (tester) async {
      await tester.pumpWidget(buildScreen());

      expect(find.text('Message'), findsOneWidget);
      expect(find.text('Dr. David Chen'), findsOneWidget);
      expect(find.text('Today • 8:42 AM'), findsOneWidget);
      expect(find.text('Your lab results are available'), findsOneWidget);
      expect(find.textContaining('Hi Maya'), findsOneWidget);
      expect(
        find.text('✓ Results reviewed by care team'),
        findsOneWidget,
      );
      expect(
        find.text('No urgent follow-up is required.'),
        findsOneWidget,
      );
    },
  );

  testWidgets('message detail displays prototype actions', (tester) async {
    await tester.pumpWidget(buildScreen());

    expect(find.text('View lab results'), findsOneWidget);
    expect(find.text('Reply'), findsOneWidget);
  });

testWidgets('view lab results shows prototype feedback', (tester) async {
  await tester.pumpWidget(buildScreen());

  final button = find.text('View lab results');

  await tester.ensureVisible(button);
  await tester.pumpAndSettle();

  await tester.tap(button);
  await tester.pump();

  expect(
    find.text('Lab results are not available in this prototype.'),
    findsOneWidget,
  );
});
  testWidgets('reply shows prototype feedback', (tester) async {
  await tester.pumpWidget(buildScreen());

  final button = find.text('Reply');

  await tester.ensureVisible(button);
  await tester.pumpAndSettle();

  await tester.tap(button);
  await tester.pump();

  expect(
    find.text('Reply is not available in this prototype.'),
    findsOneWidget,
  );
});

  testWidgets('message detail supports enlarged text', (tester) async {
    await tester.pumpWidget(
      MediaQuery(
        data: const MediaQueryData(
          textScaler: TextScaler.linear(2.0),
        ),
        child: MaterialApp(
          home: MessageDetailScreen(
            message: testMessage,
          ),
        ),
      ),
    );

    await tester.pumpAndSettle();

    expect(find.text('Your lab results are available'), findsOneWidget);
    expect(find.text('View lab results'), findsOneWidget);
    expect(find.text('Reply'), findsOneWidget);

    expect(tester.takeException(), isNull);
  });
  testWidgets('back button returns to previous screen', (tester) async {
  await tester.pumpWidget(
    MaterialApp(
      home: Builder(
        builder: (context) {
          return Scaffold(
            body: Center(
              child: ElevatedButton(
                onPressed: () {
                  Navigator.of(context).push(
                    MaterialPageRoute(
                      builder: (_) => MessageDetailScreen(
                        message: testMessage,
                      ),
                    ),
                  );
                },
                child: const Text('Open message'),
              ),
            ),
          );
        },
      ),
    ),
  );

  await tester.tap(find.text('Open message'));
  await tester.pumpAndSettle();

  expect(find.text('Message'), findsOneWidget);
  expect(find.text('Dr. David Chen'), findsOneWidget);

  await tester.tap(find.byTooltip('Back to messages'));
  await tester.pumpAndSettle();

  expect(find.text('Open message'), findsOneWidget);
  expect(find.text('Dr. David Chen'), findsNothing);
});
}