import { screen } from '@testing-library/react-native';

import { DashboardScreen } from '../src/screens/DashboardScreen';
import { renderWithProviders } from '../src/test-utils/renderWithProviders';

describe('DashboardScreen', () => {
  test('renders the approved appointment and quick-access summary', async () => {
    await renderWithProviders(<DashboardScreen />);

    expect(screen.getByText('Dr. Elena Martinez')).toBeVisible();
    expect(screen.getByText('Sep 4 • 10:30 AM')).toBeVisible();
    expect(screen.getByLabelText('Messages, 2 unread')).toBeVisible();
    expect(screen.getByLabelText('Medical notes, 3 recent')).toBeVisible();
  });

  test('identifies Home as the selected root navigation item', async () => {
    await renderWithProviders(<DashboardScreen />);

    expect(screen.getByLabelText('Home').props.accessibilityState).toEqual({
      selected: true,
    });
  });
});
