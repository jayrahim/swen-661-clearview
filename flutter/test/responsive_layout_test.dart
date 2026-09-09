import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:clearview_flutter/screens/accessibility_settings_screen.dart';
import 'package:clearview_flutter/screens/appointment_detail_screen.dart';
import 'package:clearview_flutter/screens/appointments_screen.dart';
import 'package:clearview_flutter/screens/dashboard_screen.dart';
import 'package:clearview_flutter/screens/messages_screen.dart';
import 'package:clearview_flutter/state/accessibility_preferences.dart';
import 'package:clearview_flutter/theme/app_theme.dart';
import 'package:clearview_flutter/widgets/ui_components.dart';

void main() {
  Future<void> pumpScreen(
    WidgetTester tester, {
    required Size size,
    required Widget child,
    double textScale = 1,
    bool highContrast = false,
    ProviderContainer? container,
  }) async {
    tester.view.devicePixelRatio = 1;
    tester.view.physicalSize = size;
    tester.platformDispatcher.textScaleFactorTestValue = textScale;
    addTearDown(tester.view.resetDevicePixelRatio);
    addTearDown(tester.view.resetPhysicalSize);
    addTearDown(tester.platformDispatcher.clearTextScaleFactorTestValue);

    final scope = container ?? ProviderContainer();
    if (container == null) {
      addTearDown(scope.dispose);
    }
    await tester.pumpWidget(
      UncontrolledProviderScope(
        container: scope,
        child: MaterialApp(
          theme: AppTheme.lightTheme(highContrast: highContrast),
          home: child,
        ),
      ),
    );
    await tester.pumpAndSettle();
  }

  testWidgets('dashboard keeps bottom navigation on a phone', (tester) async {
    await pumpScreen(
      tester,
      size: const Size(360, 800),
      child: const DashboardScreen(),
    );

    expect(find.byType(ClearViewBottomNavigation), findsOneWidget);
    expect(find.byKey(const Key('clearview-side-navigation')), findsNothing);
    expect(tester.takeException(), isNull);
  });

  testWidgets('phone Messages navigation opens the Messages workflow', (
    tester,
  ) async {
    await pumpScreen(
      tester,
      size: const Size(360, 800),
      child: const DashboardScreen(),
    );

    final messagesNavigation = find.descendant(
      of: find.byType(ClearViewBottomNavigation),
      matching: find.text('Messages'),
    );
    await tester.tap(messagesNavigation);
    await tester.pumpAndSettle();

    expect(find.byType(MessagesScreen), findsOneWidget);
    expect(tester.takeException(), isNull);
  });

  testWidgets('Messages retains side navigation when opened on a tablet', (
    tester,
  ) async {
    await pumpScreen(
      tester,
      size: const Size(1024, 768),
      child: const DashboardScreen(),
    );

    final messagesNavigation = find.descendant(
      of: find.byKey(const Key('clearview-side-navigation')),
      matching: find.text('Messages'),
    );
    await tester.tap(messagesNavigation);
    await tester.pumpAndSettle();

    expect(find.byType(MessagesScreen), findsOneWidget);
    expect(find.byKey(const Key('clearview-side-navigation')), findsOneWidget);
    expect(find.byType(ClearViewBottomNavigation), findsNothing);
    expect(tester.takeException(), isNull);
  });

  testWidgets('Settings side navigation opens Accessibility Settings', (
    tester,
  ) async {
    await pumpScreen(
      tester,
      size: const Size(1024, 768),
      child: const DashboardScreen(),
    );

    final settingsNavigation = find.descendant(
      of: find.byKey(const Key('clearview-side-navigation')),
      matching: find.text('Settings'),
    );
    await tester.tap(settingsNavigation);
    await tester.pumpAndSettle();

    expect(find.byType(AccessibilitySettingsScreen), findsOneWidget);
    expect(find.byKey(const Key('clearview-side-navigation')), findsOneWidget);
    expect(tester.takeException(), isNull);
  });

  testWidgets('Settings side navigation opens Messages', (tester) async {
    await pumpScreen(
      tester,
      size: const Size(1024, 768),
      child: const DashboardScreen(),
    );

    final settingsNavigation = find.descendant(
      of: find.byKey(const Key('clearview-side-navigation')),
      matching: find.text('Settings'),
    );
    await tester.tap(settingsNavigation);
    await tester.pumpAndSettle();

    final messagesNavigation = find.descendant(
      of: find.byKey(const Key('clearview-side-navigation')),
      matching: find.text('Messages'),
    );
    await tester.tap(messagesNavigation);
    await tester.pumpAndSettle();

    expect(find.byType(MessagesScreen), findsOneWidget);
    expect(tester.takeException(), isNull);
  });

  testWidgets('Appointment Detail side navigation opens Messages', (
    tester,
  ) async {
    await pumpScreen(
      tester,
      size: const Size(1024, 768),
      child: const DashboardScreen(),
    );

    await tester.tap(
      find.descendant(
        of: find.byKey(const Key('clearview-side-navigation')),
        matching: find.text('Visits'),
      ),
    );
    await tester.pumpAndSettle();
    await tester.tap(find.text('Dr. Elena Martinez'));
    await tester.pumpAndSettle();

    await tester.tap(
      find.descendant(
        of: find.byKey(const Key('clearview-side-navigation')),
        matching: find.text('Messages'),
      ),
    );
    await tester.pumpAndSettle();

    expect(find.byType(MessagesScreen), findsOneWidget);
    expect(tester.takeException(), isNull);
  });

  testWidgets('Medical Note Detail side navigation opens Messages', (
    tester,
  ) async {
    await pumpScreen(
      tester,
      size: const Size(1024, 768),
      child: const DashboardScreen(),
    );

    await tester.tap(
      find.descendant(
        of: find.byKey(const Key('clearview-side-navigation')),
        matching: find.text('Records'),
      ),
    );
    await tester.pumpAndSettle();
    await tester.tap(find.text('Primary Care Follow-up'));
    await tester.pumpAndSettle();

    await tester.tap(
      find.descendant(
        of: find.byKey(const Key('clearview-side-navigation')),
        matching: find.text('Messages'),
      ),
    );
    await tester.pumpAndSettle();

    expect(find.byType(MessagesScreen), findsOneWidget);
    expect(tester.takeException(), isNull);
  });

  testWidgets('navigation uses the phone layout below the tablet breakpoint', (
    tester,
  ) async {
    await pumpScreen(
      tester,
      size: const Size(599, 900),
      child: const DashboardScreen(),
    );

    expect(find.byType(ClearViewBottomNavigation), findsOneWidget);
    expect(find.byKey(const Key('clearview-side-navigation')), findsNothing);
  });

  testWidgets('navigation uses the tablet layout at the tablet breakpoint', (
    tester,
  ) async {
    await pumpScreen(
      tester,
      size: const Size(600, 900),
      child: const DashboardScreen(),
    );

    expect(find.byKey(const Key('clearview-side-navigation')), findsOneWidget);
    expect(find.byType(ClearViewBottomNavigation), findsNothing);
  });

  testWidgets('dashboard uses two Quick Access columns on a landscape phone', (
    tester,
  ) async {
    await pumpScreen(
      tester,
      size: const Size(840, 390),
      child: const DashboardScreen(),
    );

    final grid = tester.widget<GridView>(find.byType(GridView));
    final delegate =
        grid.gridDelegate as SliverGridDelegateWithFixedCrossAxisCount;
    expect(delegate.crossAxisCount, 2);
    expect(tester.takeException(), isNull);
  });

  testWidgets(
    'Quick Access tiles do not overflow under aggressive text scaling',
    (tester) async {
      await pumpScreen(
        tester,
        size: const Size(360, 800),
        textScale: 2,
        child: const DashboardScreen(),
      );

      final grid = tester.widget<GridView>(find.byType(GridView));
      final delegate =
          grid.gridDelegate as SliverGridDelegateWithFixedCrossAxisCount;
      expect(delegate.crossAxisCount, 1);
      expect(tester.takeException(), isNull);
    },
  );

  testWidgets('dashboard uses side navigation on a tablet portrait', (
    tester,
  ) async {
    await pumpScreen(
      tester,
      size: const Size(800, 1280),
      child: const DashboardScreen(),
    );

    expect(find.byKey(const Key('clearview-side-navigation')), findsOneWidget);
    expect(find.byType(ClearViewBottomNavigation), findsNothing);

    await tester.tap(find.text('Visits'));
    await tester.pumpAndSettle();
    expect(find.byType(AppointmentsScreen), findsOneWidget);

    // The active destination is intentionally not a second tappable route.
    await tester.tap(find.text('Visits'));
    await tester.pumpAndSettle();
    expect(find.byType(AppointmentsScreen), findsOneWidget);
    expect(tester.takeException(), isNull);
  });

  testWidgets('Visits navigation from appointment detail opens appointments', (
    tester,
  ) async {
    await pumpScreen(
      tester,
      size: const Size(800, 1280),
      child: const DashboardScreen(),
    );

    await tester.tap(find.text('View details  →'));
    await tester.pumpAndSettle();
    expect(find.byType(AppointmentDetailScreen), findsOneWidget);

    await tester.tap(find.text('Visits'));
    await tester.pumpAndSettle();
    expect(find.byType(AppointmentsScreen), findsOneWidget);
    expect(tester.takeException(), isNull);
  });

  testWidgets('appointment prototype actions show feedback on a tablet', (
    tester,
  ) async {
    await pumpScreen(
      tester,
      size: const Size(834, 1194),
      child: const DashboardScreen(),
    );

    await tester.tap(find.text('View details  →'));
    await tester.pumpAndSettle();
    await tester.tap(find.text('Get directions'));
    await tester.pump();

    expect(
      find.text('Directions are not available in this prototype.'),
      findsOneWidget,
    );
    expect(tester.takeException(), isNull);
  });

  testWidgets('dashboard supports tablet landscape with larger text', (
    tester,
  ) async {
    await pumpScreen(
      tester,
      size: const Size(1280, 800),
      textScale: 1.5,
      child: const DashboardScreen(),
    );

    final grid = tester.widget<GridView>(find.byType(GridView));
    final delegate =
        grid.gridDelegate as SliverGridDelegateWithFixedCrossAxisCount;
    expect(delegate.crossAxisCount, 4);
    expect(find.byKey(const Key('clearview-side-navigation')), findsOneWidget);
    expect(tester.takeException(), isNull);
  });

  testWidgets(
    'side navigation remains safe on a short tablet with large text',
    (tester) async {
      await pumpScreen(
        tester,
        size: const Size(1280, 600),
        textScale: 2,
        highContrast: true,
        child: const DashboardScreen(),
      );

      expect(find.byType(ClearViewSideNavigation), findsOneWidget);
      expect(find.byType(ListView), findsWidgets);
      expect(tester.takeException(), isNull);
    },
  );

  testWidgets('Accessibility Settings uses side navigation on a tablet', (
    tester,
  ) async {
    await pumpScreen(
      tester,
      size: const Size(800, 1280),
      child: const AccessibilitySettingsScreen(),
    );

    expect(find.byKey(const Key('clearview-side-navigation')), findsOneWidget);
    expect(find.text('High contrast'), findsOneWidget);
    expect(tester.takeException(), isNull);
  });

  testWidgets('Messages supports a tablet with larger text', (tester) async {
    await pumpScreen(
      tester,
      size: const Size(1024, 768),
      textScale: 2,
      child: const MessagesScreen(),
    );

    expect(find.byKey(const Key('clearview-side-navigation')), findsOneWidget);
    expect(find.text('2 unread'), findsOneWidget);
    expect(tester.takeException(), isNull);
  });

  testWidgets('Appointments supports a tablet with larger text', (
    tester,
  ) async {
    await pumpScreen(
      tester,
      size: const Size(1024, 768),
      textScale: 2,
      child: const DashboardScreen(),
    );

    final visitsNavigation = find.descendant(
      of: find.byKey(const Key('clearview-side-navigation')),
      matching: find.text('Visits'),
    );
    await tester.tap(visitsNavigation);
    await tester.pumpAndSettle();

    expect(find.byType(AppointmentsScreen), findsOneWidget);
    expect(tester.takeException(), isNull);
  });

  testWidgets('Appointment Detail supports a tablet with larger text', (
    tester,
  ) async {
    await pumpScreen(
      tester,
      size: const Size(1024, 768),
      textScale: 2,
      child: const DashboardScreen(),
    );

    await tester.tap(find.text('View details  →'));
    await tester.pumpAndSettle();

    expect(find.byType(AppointmentDetailScreen), findsOneWidget);
    expect(tester.takeException(), isNull);
  });

  testWidgets('Accessibility Settings supports a tablet with larger text', (
    tester,
  ) async {
    await pumpScreen(
      tester,
      size: const Size(1024, 768),
      textScale: 2,
      child: const AccessibilitySettingsScreen(),
    );

    expect(find.byKey(const Key('clearview-side-navigation')), findsOneWidget);
    expect(find.text('Reset preferences'), findsOneWidget);
    expect(tester.takeException(), isNull);
  });

  testWidgets('combined accessibility preferences remain safe on a tablet', (
    tester,
  ) async {
    final container = ProviderContainer();
    addTearDown(container.dispose);
    final preferences = container.read(
      accessibilityPreferencesProvider.notifier,
    );
    preferences.cycleTextSize();
    preferences.toggleReducedClutter();

    await pumpScreen(
      tester,
      size: const Size(1280, 800),
      textScale: 1.5,
      container: container,
      child: const DashboardScreen(),
    );

    expect(
      container.read(accessibilityPreferencesProvider).reducedClutter,
      isTrue,
    );
    expect(find.byKey(const Key('clearview-side-navigation')), findsOneWidget);
    expect(tester.takeException(), isNull);
  });
}
