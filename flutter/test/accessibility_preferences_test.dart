import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import 'package:clearview_flutter/state/accessibility_preferences.dart';

void main() {
  test('accessibility preferences update and reset within a session', () {
    final container = ProviderContainer();
    addTearDown(container.dispose);
    final controller = container.read(
      accessibilityPreferencesProvider.notifier,
    );

    expect(
      container.read(accessibilityPreferencesProvider).textSize,
      TextSizePreference.large,
    );
    expect(
      TextSizePreference.standard.scaleFactor,
      isNot(TextSizePreference.large.scaleFactor),
    );
    expect(
      TextSizePreference.large.scaleFactor,
      isNot(TextSizePreference.extraLarge.scaleFactor),
    );
    controller.cycleTextSize();
    controller.toggleHighContrast();
    controller.toggleReducedClutter();

    final changed = container.read(accessibilityPreferencesProvider);
    expect(changed.textSize, TextSizePreference.extraLarge);
    expect(changed.highContrast, isFalse);
    expect(changed.reducedClutter, isTrue);

    controller.reset();
    expect(
      container.read(accessibilityPreferencesProvider).highContrast,
      isTrue,
    );
    expect(
      container.read(accessibilityPreferencesProvider).reducedClutter,
      isFalse,
    );
  });
}
