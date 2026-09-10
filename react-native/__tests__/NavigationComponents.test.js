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

  test('BottomNavigation invokes only implemented navigation destinations', async () => {
    const onMessages = jest.fn();
    const user = userEvent.setup();

    await renderWithProviders(
      <BottomNavigation
        activeItem="home"
        onNavigate={{ messages: onMessages }}
      />,
    );

    await user.press(screen.getByLabelText('Messages'));

    expect(onMessages).toHaveBeenCalledTimes(1);
    expect(screen.getByLabelText('Home').props.accessibilityState).toEqual({
      selected: true,
    });
  });
});
