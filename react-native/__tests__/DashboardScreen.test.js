import { screen } from '@testing-library/react-native';

import { getUnreadMessageCount } from '../src/repositories/messagesRepository';
import { DashboardScreen } from '../src/screens/DashboardScreen';
import { defaultAccessibilityPreferences } from '../src/state/accessibilityPreferences';
import { renderWithProviders } from '../src/test-utils/renderWithProviders';

describe('DashboardScreen', () => {
  test('renders the approved appointment and quick-access summary', async () => {
    await renderWithProviders(<DashboardScreen />);

    expect(screen.getByText('Dr. Elena Martinez')).toBeVisible();
    expect(screen.getByText('Sep 4 • 10:30 AM')).toBeVisible();

    const unreadCount = getUnreadMessageCount();

    expect(
      screen.getByLabelText(`Messages, ${unreadCount} unread`),
    ).toBeVisible();

    expect(screen.getByLabelText('Medical notes, 3 recent')).toBeVisible();
  });

  test('identifies Home as the selected root navigation item', async () => {
    await renderWithProviders(<DashboardScreen />);

    expect(screen.getByLabelText('Home')).toBeSelected();
  });

  test('hides Quick Access tiles when Reduced Clutter is enabled', async () => {
    await renderWithProviders(<DashboardScreen />, {
      initialPreferences: {
        ...defaultAccessibilityPreferences,
        reducedClutter: true,
      },
    });

    const unreadCount = getUnreadMessageCount();

    expect(
      screen.queryByLabelText(`Messages, ${unreadCount} unread`),
    ).toBeNull();

    expect(screen.getByText('Text: Large • High contrast: On')).toBeVisible();
  });
});
