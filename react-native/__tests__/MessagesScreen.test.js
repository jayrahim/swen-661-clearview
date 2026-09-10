import { screen, userEvent } from '@testing-library/react-native';

import { MessagesScreen } from '../src/screens/MessagesScreen';
import { renderWithProviders } from '../src/test-utils/renderWithProviders';

describe('MessagesScreen', () => {
  test('renders the Messages list and Compose control', async () => {
    await renderWithProviders(<MessagesScreen onSelectMessage={jest.fn()} />);

    expect(screen.getByRole('header', { name: 'Messages' })).toBeVisible();

    expect(
      screen.getByRole('button', { name: 'Compose message' }),
    ).toBeVisible();

    expect(screen.getByText('Dr. David Chen')).toBeVisible();
    expect(screen.getByText('Lab results available')).toBeVisible();
    expect(screen.getByText('Care Team')).toBeVisible();
    expect(screen.getByText('Appointment reminder')).toBeVisible();
    expect(screen.getByText('Vision Center')).toBeVisible();
    expect(screen.getByText('Referral update')).toBeVisible();
  });

  test('shows an out-of-scope message when Compose is pressed', async () => {
    const user = userEvent.setup();

    await renderWithProviders(<MessagesScreen onSelectMessage={jest.fn()} />);

    await user.press(
      screen.getByRole('button', {
        name: 'Compose message',
      }),
    );

    expect(
      screen.getByText(
        'Composing a new message is not part of the scope of this prototype.',
      ),
    ).toBeVisible();
  });

  test('passes the selected message when a message is pressed', async () => {
    const user = userEvent.setup();
    const onSelectMessage = jest.fn();

    await renderWithProviders(
      <MessagesScreen onSelectMessage={onSelectMessage} />,
    );

    await user.press(
      screen.getByRole('button', {
        name: 'Dr. David Chen, Lab results available',
      }),
    );

    expect(onSelectMessage).toHaveBeenCalledTimes(1);

    expect(onSelectMessage).toHaveBeenCalledWith(
      expect.objectContaining({
        sender: 'Dr. David Chen',
        subject: 'Lab results available',
        type: 'lab-results',
      }),
    );
  });

  test('returns to Home from root navigation', async () => {
    const user = userEvent.setup();
    const onHome = jest.fn();

    await renderWithProviders(<MessagesScreen onNavigate={{ home: onHome }} />);

    await user.press(
      screen.getByRole('tab', {
        name: 'Home',
      }),
    );

    expect(onHome).toHaveBeenCalledTimes(1);
  });
});
