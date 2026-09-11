import { screen, userEvent } from '@testing-library/react-native';

import { AppNavigator } from '../src/navigation/AppNavigator';
import { getUnreadMessageCount } from '../src/repositories/messagesRepository';
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

  test('switches from Dashboard to the Appointments root and returns through Home', async () => {
    const user = userEvent.setup();

    await renderWithProviders(<AppNavigator />);

    await user.press(screen.getByRole('button', { name: 'Sign in' }));
    await user.press(screen.getByRole('tab', { name: 'Visits' }));
    expect(screen.getByRole('header', { name: 'Appointments' })).toBeVisible();
    expect(
      screen.queryByRole('button', { name: 'Back to dashboard' }),
    ).not.toBeOnTheScreen();

    await user.press(screen.getByRole('tab', { name: 'Home' }));
    expect(
      screen.getByRole('header', { name: 'Good morning, Maya' }),
    ).toBeVisible();
  });

  test('opens Settings as a root destination and returns to Dashboard', async () => {
    const user = userEvent.setup();

    await renderWithProviders(<AppNavigator />);

    await user.press(screen.getByRole('button', { name: 'Sign in' }));
    await user.press(
      screen.getByRole('button', { name: 'Accessibility settings' }),
    );
    expect(screen.getByRole('header', { name: 'Accessibility' })).toBeVisible();

    await user.press(screen.getByRole('button', { name: 'Back to dashboard' }));
    expect(
      screen.getByRole('header', { name: 'Good morning, Maya' }),
    ).toBeVisible();
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
  });

  test('uses Messages as a root route and returns from message detail', async () => {
    const user = userEvent.setup();

    await renderWithProviders(<AppNavigator />);

    await user.press(screen.getByRole('button', { name: 'Sign in' }));

    await user.press(
      screen.getByRole('button', {
        name: `Messages, ${getUnreadMessageCount()} unread`,
      }),
    );

    expect(screen.getByRole('header', { name: 'Messages' })).toBeVisible();

    await user.press(
      screen.getByRole('button', {
        name: /Unread message from Dr\. David Chen\. Your lab results are available/,
      }),
    );

    expect(
      screen.getByRole('header', {
        name: 'Message',
      }),
    ).toBeVisible();

    expect(screen.getByText('Your lab results are available')).toBeVisible();

    await user.press(screen.getByRole('button', { name: 'Back to messages' }));

    expect(screen.getByRole('header', { name: 'Messages' })).toBeVisible();

    await user.press(screen.getByRole('tab', { name: 'Home' }));

    expect(
      screen.getByRole('header', { name: 'Good morning, Maya' }),
    ).toBeVisible();
  });

  test('opens Messages from the root Messages tab', async () => {
    const user = userEvent.setup();

    await renderWithProviders(<AppNavigator />);

    await user.press(screen.getByRole('button', { name: 'Sign in' }));

    await user.press(screen.getByRole('tab', { name: 'Messages' }));

    expect(screen.getByRole('header', { name: 'Messages' })).toBeVisible();
    expect(screen.getByLabelText('Messages')).toBeSelected();
  });
});
