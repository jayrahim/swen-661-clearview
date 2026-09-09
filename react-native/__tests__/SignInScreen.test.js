import { screen, userEvent } from '@testing-library/react-native';

import { SignInScreen } from '../src/screens/SignInScreen';
import { renderWithProviders } from '../src/test-utils/renderWithProviders';

describe('SignInScreen', () => {
  test('allows a user to show their password', async () => {
    const user = userEvent.setup();

    await renderWithProviders(<SignInScreen onSignIn={jest.fn()} />);

    expect(screen.getByLabelText('Password').props.secureTextEntry).toBe(true);

    await user.press(screen.getByRole('button', { name: 'Show password' }));

    expect(screen.getByLabelText('Password').props.secureTextEntry).toBe(false);
    expect(screen.getByRole('button', { name: 'Hide password' })).toBeVisible();
  });

  test('provides prototype feedback for password recovery', async () => {
    const user = userEvent.setup();

    await renderWithProviders(<SignInScreen onSignIn={jest.fn()} />);

    await user.press(screen.getByRole('button', { name: 'Forgot password?' }));

    expect(
      screen.getByText('Password recovery is not available in this prototype.'),
    ).toBeVisible();
  });
});
