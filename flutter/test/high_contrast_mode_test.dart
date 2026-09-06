import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:clearview_flutter/main.dart';
import 'package:clearview_flutter/screens/accessibility_settings_screen.dart';
import 'package:clearview_flutter/screens/dashboard_screen.dart';
import 'package:clearview_flutter/state/accessibility_preferences.dart';
import 'package:clearview_flutter/theme/app_colors.dart';
import 'package:clearview_flutter/theme/app_theme.dart';
import 'package:clearview_flutter/theme/clearview_tokens.dart';

void main() {
  test('high contrast and normal themes expose distinct visual tokens', () {
    final highContrast = AppTheme.lightTheme(highContrast: true)
        .extension<ClearViewTokens>()!;
    final normal = AppTheme.lightTheme(highContrast: false)
        .extension<ClearViewTokens>()!;

    expect(highContrast.isHighContrast, isTrue);
    expect(highContrast.background, AppColors.surface);
    expect(highContrast.border, AppColors.highContrastInk);
    expect(highContrast.borderWidth, 2);
    expect(highContrast.primary, AppColors.highContrastPrimary);
    expect(normal.isHighContrast, isFalse);
    expect(normal.background, AppColors.background);
    expect(normal.borderWidth, 1);
  });

  testWidgets('high contrast toggle immediately updates the dashboard theme', (
    tester,
  ) async {
    final container = ProviderContainer();
    addTearDown(container.dispose);
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
    final dashboard = find.byType(DashboardScreen);
    expect(
      Theme.of(tester.element(dashboard))
          .extension<ClearViewTokens>()!
          .isHighContrast,
      isTrue,
    );

    container
        .read(accessibilityPreferencesProvider.notifier)
        .toggleHighContrast();
    await tester.pumpAndSettle();

    final normalTokens = Theme.of(tester.element(dashboard))
        .extension<ClearViewTokens>()!;
    expect(
      container.read(accessibilityPreferencesProvider).highContrast,
      isFalse,
    );
    expect(normalTokens.isHighContrast, isFalse);
    expect(normalTokens.background, AppColors.background);
    expect(normalTokens.borderWidth, 1);

    container
        .read(accessibilityPreferencesProvider.notifier)
        .toggleHighContrast();
    await tester.pumpAndSettle();
    expect(
      Theme.of(tester.element(dashboard))
          .extension<ClearViewTokens>()!
          .borderWidth,
      2,
    );
  });

  testWidgets(
    'Accessibility Settings reflects the visible high contrast toggle',
    (tester) async {
      final container = ProviderContainer();
      addTearDown(container.dispose);
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
      final accessibilityPreferences = find.text('Accessibility preferences');
      await tester.ensureVisible(accessibilityPreferences);
      await tester.tap(accessibilityPreferences);
      await tester.pumpAndSettle();

      final settings = find.byType(AccessibilitySettingsScreen);
      expect(find.text('On'), findsOneWidget);
      expect(
        Theme.of(tester.element(settings))
            .extension<ClearViewTokens>()!
            .borderWidth,
        2,
      );

      await tester.tap(find.text('High contrast'));
      await tester.pumpAndSettle();

      expect(
        container.read(accessibilityPreferencesProvider).highContrast,
        isFalse,
      );
      expect(
        Theme.of(tester.element(settings))
            .extension<ClearViewTokens>()!
            .borderWidth,
        1,
      );
    },
  );
}
