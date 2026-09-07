import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import 'package:clearview_flutter/screens/dashboard_screen.dart';
import 'package:clearview_flutter/screens/medical_notes_screen.dart';
import 'package:clearview_flutter/state/accessibility_preferences.dart';

Widget buildTestApp(Widget child) {
  return ProviderScope(
    child: MaterialApp(
      home: child,
    ),
  );
}

void main() {
  testWidgets(
    'medical notes list renders repository-backed content',
    (tester) async {
      await tester.pumpWidget(
        buildTestApp(const MedicalNotesScreen()),
      );

      await tester.pumpAndSettle();

      expect(find.text('Medical Notes'), findsOneWidget);
      expect(find.text('Recent notes'), findsOneWidget);
      expect(find.text('Open →'), findsWidgets);
    },
  );

  testWidgets(
    'selecting a note opens its specific detail content',
    (tester) async {
      await tester.pumpWidget(
        buildTestApp(const MedicalNotesScreen()),
      );

      await tester.pumpAndSettle();

      final openButton = find.text('Open →').first;
      await tester.tap(openButton);
      await tester.pumpAndSettle();

      expect(find.text('Visit Note'), findsOneWidget);
      expect(find.text('Summary'), findsOneWidget);
      expect(find.text('Need help understanding this note?'), findsOneWidget);
    },
  );

  testWidgets(
    'back navigation returns to the medical notes list',
    (tester) async {
      await tester.pumpWidget(
        buildTestApp(const MedicalNotesScreen()),
      );

      await tester.pumpAndSettle();

      await tester.tap(find.text('Open →').first);
      await tester.pumpAndSettle();

      expect(find.text('Visit Note'), findsOneWidget);

      await tester.tap(find.byTooltip('Back to Medical Notes'));
      await tester.pumpAndSettle();

      expect(find.text('Medical Notes'), findsOneWidget);
      expect(find.text('Recent notes'), findsOneWidget);
    },
  );

  testWidgets(
    'larger text scaling does not overflow medical notes',
    (tester) async {
      await tester.pumpWidget(
        MediaQuery(
          data: const MediaQueryData(
            textScaler: TextScaler.linear(2.0),
          ),
          child: buildTestApp(const MedicalNotesScreen()),
        ),
      );

      await tester.pumpAndSettle();

      expect(find.text('Medical Notes'), findsOneWidget);
      expect(find.text('Recent notes'), findsOneWidget);

      expect(tester.takeException(), isNull);
    },
  );

  testWidgets(
    'high contrast and reduced clutter preferences remain compatible',
    (tester) async {
      final container = ProviderContainer();
      addTearDown(container.dispose);

      await tester.pumpWidget(
        UncontrolledProviderScope(
          container: container,
          child: const MaterialApp(
            home: MedicalNotesScreen(),
          ),
        ),
      );

      await tester.pumpAndSettle();

      expect(find.text('Medical Notes'), findsOneWidget);
      expect(find.text('Recent notes'), findsOneWidget);

      expect(
        container.read(accessibilityPreferencesProvider),
        isA<AccessibilityPreferences>(),
      );

      expect(tester.takeException(), isNull);
    },
  );

  testWidgets(
    'dashboard Quick Access Medical Notes opens medical notes',
    (tester) async {
      await tester.pumpWidget(
        buildTestApp(const DashboardScreen()),
      );

      await tester.pumpAndSettle();

      final medicalNotes = find.text('Medical notes');

      expect(medicalNotes, findsWidgets);

      await tester.tap(medicalNotes.first);
      await tester.pumpAndSettle();

      expect(find.text('Medical Notes'), findsOneWidget);
      expect(find.text('Recent notes'), findsOneWidget);
    },
  );

  testWidgets(
    'dashboard Records navigation opens medical notes',
    (tester) async {
      await tester.pumpWidget(
        buildTestApp(const DashboardScreen()),
      );

      await tester.pumpAndSettle();

      final records = find.text('Records');

      expect(records, findsOneWidget);

      await tester.tap(records);
      await tester.pumpAndSettle();

      expect(find.text('Medical Notes'), findsOneWidget);
      expect(find.text('Recent notes'), findsOneWidget);
    },
  );
}