import { render } from '@testing-library/react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AccessibilityPreferencesProvider } from '../state/accessibilityPreferences';
import { PrototypeFeedbackProvider } from '../components/PrototypeFeedback';

/**
 * Stable test seam for app-level providers. Add shared state providers here as
 * feature PRs introduce them instead of duplicating provider setup in tests.
 */
export async function renderWithProviders(
  ui,
  { initialPreferences, ...options } = {},
) {
  return render(
    <SafeAreaProvider>
      <AccessibilityPreferencesProvider initialPreferences={initialPreferences}>
        <PrototypeFeedbackProvider>{ui}</PrototypeFeedbackProvider>
      </AccessibilityPreferencesProvider>
    </SafeAreaProvider>,
    options,
  );
}
