import { render } from '@testing-library/react-native';

/**
 * Stable test seam for app-level providers added by later feature PRs.
 * Keeping the helper provider-free now avoids duplicating test setup later.
 */
export async function renderWithProviders(ui, options) {
  return render(ui, options);
}
