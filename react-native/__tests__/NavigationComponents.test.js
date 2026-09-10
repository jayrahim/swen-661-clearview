import { screen, userEvent } from '@testing-library/react-native';

import { BottomNavigation } from '../src/components/BottomNavigation';
import { QuickAccessTile } from '../src/components/QuickAccessTile';
import { colors } from '../src/theme/tokens';
import { renderWithProviders } from '../src/test-utils/renderWithProviders';

describe('shared navigation components', () => {
  test('QuickAccessTile exposes and invokes an action when a handler is supplied', async () => {
    const onPress = jest.fn();
    const user = userEvent.setup();

    await renderWithProviders(
      <QuickAccessTile
        item={{
          title: 'Messages',
          subtitle: '2 unread',
          backgroundColor: colors.blueTile,
          subtitleColor: colors.primary,
        }}
        onPress={onPress}
      />,
    );

    await user.press(
      screen.getByRole('button', { name: 'Messages, 2 unread' }),
    );

    expect(onPress).toHaveBeenCalledTimes(1);
  });

  test('BottomNavigation keeps unfinished destinations visible but non-interactive', async () => {
    const user = userEvent.setup();

    await renderWithProviders(
      <BottomNavigation activeItem="home" onNavigate={{ visits: jest.fn() }} />,
    );

    expect(screen.getByLabelText('Messages')).toBeDisabled();
    expect(screen.getByLabelText('Records')).toBeDisabled();
    await user.press(screen.getByRole('tab', { name: 'Visits' }));

    expect(screen.getByRole('tab', { name: 'Visits' })).toBeEnabled();
    expect(screen.getByLabelText('Home')).toBeSelected();
  });
});
