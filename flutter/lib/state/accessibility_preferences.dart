import 'package:flutter_riverpod/flutter_riverpod.dart';

enum TextSizePreference {
  standard('Standard', 0.9),
  large('Large', 1),
  extraLarge('Extra large', 1.15);

  const TextSizePreference(this.label, this.scaleFactor);
  final String label;
  final double scaleFactor;
}

class AccessibilityPreferences {
  const AccessibilityPreferences({
    this.textSize = TextSizePreference.large,
    this.highContrast = true,
    this.reducedClutter = false,
    this.colorPreference = 'Cool',
  });

  final TextSizePreference textSize;
  final bool highContrast;
  final bool reducedClutter;
  final String colorPreference;

  AccessibilityPreferences copyWith({
    TextSizePreference? textSize,
    bool? highContrast,
    bool? reducedClutter,
    String? colorPreference,
  }) => AccessibilityPreferences(
    textSize: textSize ?? this.textSize,
    highContrast: highContrast ?? this.highContrast,
    reducedClutter: reducedClutter ?? this.reducedClutter,
    colorPreference: colorPreference ?? this.colorPreference,
  );

  @override
  bool operator ==(Object other) =>
      other is AccessibilityPreferences &&
      textSize == other.textSize &&
      highContrast == other.highContrast &&
      reducedClutter == other.reducedClutter &&
      colorPreference == other.colorPreference;

  @override
  int get hashCode =>
      Object.hash(textSize, highContrast, reducedClutter, colorPreference);
}

class AccessibilityPreferencesController
    extends Notifier<AccessibilityPreferences> {
  @override
  AccessibilityPreferences build() => const AccessibilityPreferences();

  void cycleTextSize() {
    final nextIndex =
        (state.textSize.index + 1) % TextSizePreference.values.length;
    state = state.copyWith(textSize: TextSizePreference.values[nextIndex]);
  }

  void toggleHighContrast() =>
      state = state.copyWith(highContrast: !state.highContrast);

  void toggleReducedClutter() =>
      state = state.copyWith(reducedClutter: !state.reducedClutter);

  void reset() => state = const AccessibilityPreferences();
}

final accessibilityPreferencesProvider =
    NotifierProvider<
      AccessibilityPreferencesController,
      AccessibilityPreferences
    >(AccessibilityPreferencesController.new);
