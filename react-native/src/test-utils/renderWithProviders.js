import { render } from '@testing-library/react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AccessibilityPreferencesProvider } from '../state/accessibilityPreferences';

/**
 * Stable test seam for app-level providers. Add shared state providers here as
 * feature PRs introduce them instead of duplicating provider setup in tests.
 */
export async function renderWithProviders(ui, { initialPreferences, ...options } = {}) {
  return render(
    <SafeAreaProvider>
      <AccessibilityPreferencesProvider initialPreferences={initialPreferences}>
        {ui}
      </AccessibilityPreferencesProvider>
    </SafeAreaProvider>,
    options,
  );
}
