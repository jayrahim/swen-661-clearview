import { render } from '@testing-library/react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

/**
 * Stable test seam for app-level providers. Add shared state providers here as
 * feature PRs introduce them instead of duplicating provider setup in tests.
 */
export async function renderWithProviders(ui, options) {
  return render(<SafeAreaProvider>{ui}</SafeAreaProvider>, options);
}
