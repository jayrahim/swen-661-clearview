import { screen, userEvent } from '@testing-library/react-native';

import { AppNavigator } from '../src/navigation/AppNavigator';
import { renderWithProviders } from '../src/test-utils/renderWithProviders';

describe('AppNavigator', () => {
  test('moves from the sign-in screen to the Dashboard', async () => {
    const user = userEvent.setup();

    await renderWithProviders(<AppNavigator />);

    await user.press(screen.getByRole('button', { name: 'Sign in' }));

    expect(screen.getByRole('header', { name: 'Good morning, Maya' })).toBeVisible();
    expect(screen.getByText('Next appointment')).toBeVisible();
  });
});
