import { screen, userEvent } from '@testing-library/react-native';

import { AccessibilitySettingsScreen } from '../src/screens/AccessibilitySettingsScreen';
import { defaultAccessibilityPreferences } from '../src/state/accessibilityPreferences';
import { renderWithProviders } from '../src/test-utils/renderWithProviders';

describe('AccessibilitySettingsScreen', () => {
  test('updates the rendered High Contrast value immediately', async () => {
    const user = userEvent.setup();

    await renderWithProviders(<AccessibilitySettingsScreen onBack={jest.fn()} />);

    await user.press(
      screen.getByRole('button', {
        name: 'High contrast, On. Increase contrast for text and controls',
      }),
    );

    expect(
      screen.getByRole('button', {
        name: 'High contrast, Off. Increase contrast for text and controls',
      }),
    ).toBeVisible();
  });

  test('cycles the current text-size preference', async () => {
    const user = userEvent.setup();

    await renderWithProviders(<AccessibilitySettingsScreen onBack={jest.fn()} />);

    await user.press(
      screen.getByRole('button', {
        name: 'Text size, Large. Adjust text across the app',
      }),
    );

    expect(screen.getByText('Extra large')).toBeVisible();
  });

  test('resets seeded preferences to the approved defaults', async () => {
    const user = userEvent.setup();
    const initialPreferences = {
      ...defaultAccessibilityPreferences,
      highContrast: false,
      reducedClutter: true,
    };

    await renderWithProviders(<AccessibilitySettingsScreen onBack={jest.fn()} />, {
      initialPreferences,
    });

    await user.press(screen.getByRole('button', { name: 'Reset preferences' }));

    expect(screen.getByText('On')).toBeVisible();
  });

  test('provides feedback when Color Preference is unavailable', async () => {
    const user = userEvent.setup();

    await renderWithProviders(<AccessibilitySettingsScreen onBack={jest.fn()} />);

    await user.press(
      screen.getByRole('button', {
        name: 'Color preference, Cool. Use a calmer accent palette',
      }),
    );

    expect(screen.getByText('Color preference is not available in this prototype.')).toBeVisible();
  });
});
