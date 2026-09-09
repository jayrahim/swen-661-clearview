import {
  accessibilityPreferencesReducer,
  defaultAccessibilityPreferences,
} from '../src/state/accessibilityPreferences';

describe('accessibilityPreferencesReducer', () => {
  test('cycles text size and toggles shared preferences', () => {
    const larger = accessibilityPreferencesReducer(defaultAccessibilityPreferences, {
      type: 'cycle-text-size',
    });
    const contrastOff = accessibilityPreferencesReducer(larger, {
      type: 'toggle-high-contrast',
    });

    expect(larger.textSize.label).toBe('Extra large');
    expect(contrastOff.highContrast).toBe(false);
  });

  test('resets the current-session preferences to the approved defaults', () => {
    const changed = { ...defaultAccessibilityPreferences, reducedClutter: true };

    expect(accessibilityPreferencesReducer(changed, { type: 'reset' })).toEqual(
      defaultAccessibilityPreferences,
    );
  });
});
