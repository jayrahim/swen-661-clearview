import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:clearview_flutter/main.dart';
import 'package:clearview_flutter/screens/dashboard_screen.dart';
import 'package:clearview_flutter/screens/medical_note_detail_screen.dart';
import 'package:clearview_flutter/screens/medical_notes_screen.dart';
import 'package:clearview_flutter/state/accessibility_preferences.dart';
import 'package:clearview_flutter/theme/clearview_tokens.dart';

void main() {
  Widget buildNotesApp({double textScale = 1}) => ProviderScope(
    child: MaterialApp(
      home: MediaQuery(
        data: MediaQueryData(textScaler: TextScaler.linear(textScale)),
        child: const MedicalNotesScreen(),
      ),
    ),
  );

  testWidgets('Medical Notes renders repository-backed note content', (
    tester,
  ) async {
    await tester.pumpWidget(buildNotesApp());

    expect(find.text('Medical Notes'), findsOneWidget);
    expect(find.text('Recent notes'), findsOneWidget);
    expect(find.text('Primary Care Follow-up'), findsOneWidget);
    expect(find.text('Dr. David Chen'), findsOneWidget);
    expect(find.text('Cardiology Consultation'), findsOneWidget);
    expect(find.text('Reviewed'), findsNWidgets(2));
    expect(find.text('New'), findsOneWidget);
  });

  testWidgets(
    'selecting a note shows the selected note detail and back returns',
    (tester) async {
      await tester.pumpWidget(buildNotesApp());

      await tester.tap(find.text('Cardiology Consultation'));
      await tester.pumpAndSettle();

      expect(find.byType(MedicalNoteDetailScreen), findsOneWidget);
      expect(find.text('Visit Note'), findsOneWidget);
      expect(find.text('Cardiology Consultation'), findsOneWidget);
      expect(find.text('Dr. Elena Martinez • July 30, 2026'), findsOneWidget);
      expect(
        find.text(
          'Discussed recent symptoms and the next steps for cardiac care.',
        ),
        findsOneWidget,
      );

      await tester.tap(find.byTooltip('Back to medical notes'));
      await tester.pumpAndSettle();

      expect(find.byType(MedicalNotesScreen), findsOneWidget);
      expect(find.text('Recent notes'), findsOneWidget);
    },
  );

  testWidgets('Filter provides prototype feedback', (tester) async {
    await tester.pumpWidget(buildNotesApp());

    await tester.tap(find.text('Filter'));
    await tester.pump();

    expect(
      find.text('Filtering is not available in this prototype.'),
      findsOneWidget,
    );
  });

  testWidgets('Medical Note Detail renders assessment entries separately', (
    tester,
  ) async {
    await tester.pumpWidget(buildNotesApp());

    await tester.tap(find.text('Primary Care Follow-up'));
    await tester.pumpAndSettle();

    expect(
      find.text('Blood pressure remains well controlled.'),
      findsOneWidget,
    );
    expect(find.text('Vitamin D level is mildly low.'), findsOneWidget);
  });

  testWidgets('Dashboard Quick Access opens Medical Notes', (tester) async {
    await tester.pumpWidget(
      const ProviderScope(child: MaterialApp(home: DashboardScreen())),
    );

    await tester.ensureVisible(find.text('Medical notes'));
    await tester.tap(find.text('Medical notes'));
    await tester.pumpAndSettle();

    expect(find.byType(MedicalNotesScreen), findsOneWidget);
    expect(find.text('Recent notes'), findsOneWidget);
  });

  testWidgets(
    'Records navigation opens Medical Notes and active item is static',
    (tester) async {
      await tester.pumpWidget(
        const ProviderScope(child: MaterialApp(home: DashboardScreen())),
      );

      await tester.tap(find.text('Records'));
      await tester.pumpAndSettle();

      expect(find.byType(MedicalNotesScreen), findsOneWidget);
      expect(
        find.ancestor(of: find.text('Records'), matching: find.byType(InkWell)),
        findsNothing,
      );
    },
  );

  testWidgets('Medical Notes tolerates 2x text scaling without an exception', (
    tester,
  ) async {
    await tester.pumpWidget(buildNotesApp(textScale: 2));
    await tester.pumpAndSettle();

    expect(find.text('Primary Care Follow-up'), findsOneWidget);
    expect(tester.takeException(), isNull);
  });

  testWidgets(
    'High Contrast and Reduced Clutter keep Medical Notes available',
    (tester) async {
      final container = ProviderContainer();
      addTearDown(container.dispose);
      await tester.pumpWidget(
        UncontrolledProviderScope(
          container: container,
          child: const ClearViewApp(),
        ),
      );

      await tester.ensureVisible(find.text('Sign in'));
      await tester.tap(find.text('Sign in'));
      await tester.pumpAndSettle();
      await tester.ensureVisible(find.text('Medical notes'));
      await tester.tap(find.text('Medical notes'));
      await tester.pumpAndSettle();

      final notes = find.byType(MedicalNotesScreen);
      expect(
        Theme.of(tester.element(notes))
            .extension<ClearViewTokens>()!
            .borderWidth,
        2,
      );

      container
          .read(accessibilityPreferencesProvider.notifier)
          .toggleReducedClutter();
      await tester.pumpAndSettle();

      expect(
        container.read(accessibilityPreferencesProvider).reducedClutter,
        isTrue,
      );
      expect(find.text('Primary Care Follow-up'), findsOneWidget);
      expect(tester.takeException(), isNull);
    },
  );
}
