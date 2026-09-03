import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import 'package:clearview_flutter/main.dart';
import 'package:clearview_flutter/screens/accessibility_settings_screen.dart';
import 'package:clearview_flutter/screens/dashboard_screen.dart';
import 'package:clearview_flutter/state/accessibility_preferences.dart';
import 'package:clearview_flutter/theme/app_colors.dart';
import 'package:clearview_flutter/theme/app_theme.dart';

Widget buildTestApp(Widget child) =>
    ProviderScope(child: MaterialApp(home: child));

void main() {
  testWidgets('sign in renders and navigates to the dashboard', (tester) async {
    await tester.pumpWidget(const ProviderScope(child: ClearViewApp()));
    expect(find.text('Sign in to manage your care'), findsOneWidget);

    final signIn = find.text('Sign in');
    await tester.ensureVisible(signIn);
    await tester.tap(signIn);
    await tester.pumpAndSettle();
    expect(find.text('Good morning, Maya'), findsOneWidget);
  });

  testWidgets(
    'dashboard opens appointment detail for the selected appointment',
    (tester) async {
      await tester.pumpWidget(buildTestApp(const DashboardScreen()));
      expect(find.text('Dr. Elena Martinez'), findsOneWidget);

      await tester.tap(find.text('View details  →'));
      await tester.pumpAndSettle();
      expect(find.text('Appointment'), findsOneWidget);
      expect(find.text('Date and time'), findsOneWidget);
      expect(find.text('Cardiology'), findsOneWidget);
      expect(find.text('September 4, 2026 at 10:30 AM'), findsOneWidget);
    },
  );

  testWidgets('accessibility settings update shared preference state', (
    tester,
  ) async {
    final container = ProviderContainer();
    addTearDown(container.dispose);
    await tester.pumpWidget(
      UncontrolledProviderScope(
        container: container,
        child: const MaterialApp(home: AccessibilitySettingsScreen()),
      ),
    );
    expect(find.text('High contrast'), findsOneWidget);
    expect(find.text('On'), findsOneWidget);

    await tester.tap(find.text('High contrast'));
    await tester.pump();
    expect(
      container.read(accessibilityPreferencesProvider).highContrast,
      isFalse,
    );

    await tester.tap(find.text('Text size'));
    await tester.pump();
    expect(find.text('Extra large'), findsOneWidget);
  });

  test('high contrast theme uses the approved primary color', () {
    expect(
      AppTheme.lightTheme(highContrast: true).colorScheme.primary,
      AppColors.primary,
    );
    expect(
      AppTheme.lightTheme(highContrast: false).colorScheme.primary,
      isNot(AppColors.primary),
    );
  });
}
