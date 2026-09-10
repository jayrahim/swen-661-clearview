import { screen, userEvent } from '@testing-library/react-native';

import { AppNavigator } from '../src/navigation/AppNavigator';
import { renderWithProviders } from '../src/test-utils/renderWithProviders';

describe('AppNavigator', () => {
  test('moves from the sign-in screen to the Dashboard', async () => {
    const user = userEvent.setup();

    await renderWithProviders(<AppNavigator />);

    await user.press(screen.getByRole('button', { name: 'Sign in' }));

    expect(
      screen.getByRole('header', { name: 'Good morning, Maya' }),
    ).toBeVisible();
    expect(screen.getByText('Next appointment')).toBeVisible();
  });

  test('preserves the selected appointment through detail and back navigation', async () => {
    const user = userEvent.setup();

    await renderWithProviders(<AppNavigator />);

    await user.press(screen.getByRole('button', { name: 'Sign in' }));
    await user.press(screen.getByRole('tab', { name: 'Visits' }));
    expect(screen.getByRole('header', { name: 'Appointments' })).toBeVisible();

    await user.press(
      screen.getByRole('button', {
        name: 'Dr. David Chen, Primary Care, Confirmed',
      }),
    );
    expect(
      screen.getByRole('header', { name: 'Appointment Details' }),
    ).toBeVisible();
    expect(screen.getByText('Dr. David Chen')).toBeVisible();
    expect(screen.getByText('Virtual follow-up')).toBeVisible();

    await user.press(
      screen.getByRole('button', { name: 'Back to appointments' }),
    );
    expect(screen.getByRole('header', { name: 'Appointments' })).toBeVisible();

    await user.press(screen.getByRole('tab', { name: 'Home' }));
    expect(
      screen.getByRole('header', { name: 'Good morning, Maya' }),
    ).toBeVisible();
  });

  test('returns to the dashboard from the appointments header back button', async () => {
    const user = userEvent.setup();

    await renderWithProviders(<AppNavigator />);

    await user.press(screen.getByRole('button', { name: 'Sign in' }));
    await user.press(screen.getByRole('tab', { name: 'Visits' }));
    await user.press(screen.getByRole('button', { name: 'Back to dashboard' }));

    expect(
      screen.getByRole('header', { name: 'Good morning, Maya' }),
    ).toBeVisible();
  });
});
