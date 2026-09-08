import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:clearview_flutter/main.dart';
import 'package:clearview_flutter/screens/appointment_detail_screen.dart';
import 'package:clearview_flutter/screens/dashboard_screen.dart';
import 'package:clearview_flutter/screens/accessibility_settings_screen.dart';
import 'package:clearview_flutter/state/accessibility_preferences.dart';
import 'package:clearview_flutter/widgets/ui_components.dart';

void main() {
  testWidgets('Reduced clutter can be enabled and simplifies the dashboard', (
    tester,
  ) async {
    final container = ProviderContainer();
    addTearDown(container.dispose);

    container
        .read(accessibilityPreferencesProvider.notifier)
        .toggleReducedClutter();

    await tester.pumpWidget(
      UncontrolledProviderScope(
        container: container,
        child: const MaterialApp(home: DashboardScreen()),
      ),
    );

    await tester.pumpAndSettle();

    expect(
      container.read(accessibilityPreferencesProvider).reducedClutter,
      isTrue,
    );

    expect(find.text('Reduced Clutter'), findsOneWidget);
    expect(find.text('Essential actions'), findsOneWidget);
    expect(find.text('Quick Access'), findsNothing);
  });

  testWidgets('Reduced clutter appointment action opens appointment detail', (
    tester,
  ) async {
    final container = ProviderContainer();
    addTearDown(container.dispose);

    container
        .read(accessibilityPreferencesProvider.notifier)
        .toggleReducedClutter();

    await tester.pumpWidget(
      UncontrolledProviderScope(
        container: container,
        child: const MaterialApp(home: DashboardScreen()),
      ),
    );

    await tester.pumpAndSettle();

    final viewAppointment = find.text('View appointment');
    await tester.ensureVisible(viewAppointment);
    await tester.tap(viewAppointment);
    await tester.pumpAndSettle();

    expect(find.byType(AppointmentDetailScreen), findsOneWidget);
    expect(find.text('Appointment Details'), findsOneWidget);
    expect(find.text('Dr. Elena Martinez'), findsWidgets);
  });

  testWidgets(
    'Reduced clutter accessibility action opens accessibility settings',
    (tester) async {
      final container = ProviderContainer();
      addTearDown(container.dispose);

      container
          .read(accessibilityPreferencesProvider.notifier)
          .toggleReducedClutter();

      await tester.pumpWidget(
        UncontrolledProviderScope(
          container: container,
          child: const MaterialApp(home: DashboardScreen()),
        ),
      );

      await tester.pumpAndSettle();

      final accessibility = find.text('Accessibility').last;

      await tester.ensureVisible(accessibility);
      await tester.tap(accessibility);
      await tester.pumpAndSettle();

      expect(find.byType(AccessibilitySettingsScreen), findsOneWidget);
    },
  );

  testWidgets(
    'Reduced clutter only shows interactive affordances for cards with handlers',
    (tester) async {
      final container = ProviderContainer();
      addTearDown(container.dispose);

      container
          .read(accessibilityPreferencesProvider.notifier)
          .toggleReducedClutter();

      await tester.pumpWidget(
        UncontrolledProviderScope(
          container: container,
          child: const MaterialApp(home: DashboardScreen()),
        ),
      );

      await tester.pumpAndSettle();

      final messagesCard = find.ancestor(
        of: find.text('2 unread'),
        matching: find.byType(AppCard),
      );

      final medicalNotesCard = find.ancestor(
        of: find.text('3 recent'),
        matching: find.byType(AppCard),
      );

      expect(messagesCard, findsOneWidget);
      expect(medicalNotesCard, findsOneWidget);

      expect(
        find.ancestor(of: messagesCard, matching: find.byType(InkWell)),
        findsOneWidget,
      );

      expect(
        find.descendant(of: medicalNotesCard, matching: find.byType(InkWell)),
        findsNothing,
      );

      expect(
        find.descendant(
          of: messagesCard,
          matching: find.byIcon(Icons.chevron_right),
        ),
        findsOneWidget,
      );

      expect(
        find.descendant(
          of: medicalNotesCard,
          matching: find.byIcon(Icons.chevron_right),
        ),
        findsNothing,
      );
    },
  );

  testWidgets(
    'Reduced clutter preference summary reflects current accessibility state',
    (tester) async {
      final container = ProviderContainer();
      addTearDown(container.dispose);

      final controller = container.read(
        accessibilityPreferencesProvider.notifier,
      );

      controller.cycleTextSize();
      controller.toggleHighContrast();
      controller.toggleReducedClutter();

      await tester.pumpWidget(
        UncontrolledProviderScope(
          container: container,
          child: const ClearViewApp(),
        ),
      );

      final signIn = find.text('Sign in');
      await tester.ensureVisible(signIn);
      await tester.tap(signIn);
      await tester.pumpAndSettle();

      expect(
        container.read(accessibilityPreferencesProvider).textSize,
        TextSizePreference.extraLarge,
      );

      expect(
        container.read(accessibilityPreferencesProvider).highContrast,
        isFalse,
      );

      expect(find.text('Extra large text • Standard contrast'), findsOneWidget);

      controller.toggleHighContrast();
      await tester.pumpAndSettle();

      expect(find.text('Extra large text • High contrast'), findsOneWidget);
    },
  );
}
