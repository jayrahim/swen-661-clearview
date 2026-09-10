import { screen, userEvent } from '@testing-library/react-native';

import { MessageDetailScreen } from '../src/screens/MessageDetailScreen';
import { renderWithProviders } from '../src/test-utils/renderWithProviders';

const labMessage = {
  id: '1',
  sender: 'Dr. David Chen',
  subject: 'Lab results available',
  date: 'Sep 3',
  preview: 'Your recent lab results are now available to review.',
  body: 'Your recent lab results are now available. Please review them before your next appointment.',
  status: 'Unread',
  type: 'lab-results',
};

const generalMessage = {
  id: '2',
  sender: 'Care Team',
  subject: 'Appointment reminder',
  date: 'Sep 2',
  preview: 'This is a reminder about your upcoming appointment.',
  body: 'This is a reminder about your upcoming appointment. Please arrive 15 minutes early.',
  status: 'Read',
  type: 'general',
};

describe('MessageDetailScreen', () => {
  test('renders the selected message details', async () => {
    await renderWithProviders(
      <MessageDetailScreen
        message={labMessage}
        onBack={jest.fn()}
      />,
    );

    expect(
      screen.getByRole('header', {
        name: 'Lab results available',
      }),
    ).toBeVisible();

    expect(screen.getByText('Dr. David Chen')).toBeVisible();
    expect(screen.getByText('Sep 3')).toBeVisible();
    expect(screen.getByText('Status: Unread')).toBeVisible();
    expect(screen.getByText(labMessage.body)).toBeVisible();
  });

  test('shows the lab-results action for a lab message', async () => {
    await renderWithProviders(
      <MessageDetailScreen
        message={labMessage}
        onBack={jest.fn()}
      />,
    );

    expect(
      screen.getByRole('button', {
        name: 'View lab results',
      }),
    ).toBeVisible();
  });

  test('does not show the lab-results action for a general message', async () => {
    await renderWithProviders(
      <MessageDetailScreen
        message={generalMessage}
        onBack={jest.fn()}
      />,
    );

    expect(
      screen.queryByRole('button', {
        name: 'View lab results',
      }),
    ).toBeNull();
  });

  test('shows prototype feedback when View lab results is pressed', async () => {
    const user = userEvent.setup();

    await renderWithProviders(
      <MessageDetailScreen
        message={labMessage}
        onBack={jest.fn()}
      />,
    );

    await user.press(
      screen.getByRole('button', {
        name: 'View lab results',
      }),
    );

   expect(
  screen.getByText(
    'Viewing lab results is not available in this prototype.',
  ),
).toBeVisible();
  });

  test('shows prototype feedback when Reply is pressed', async () => {
    const user = userEvent.setup();

    await renderWithProviders(
      <MessageDetailScreen
        message={generalMessage}
        onBack={jest.fn()}
      />,
    );

    await user.press(
      screen.getByRole('button', {
        name: 'Reply to message',
      }),
    );

    expect(
  screen.getByText(
    'Replying to messages is not available in this prototype.',
  ),
).toBeVisible();
  });

  test('returns to Messages when the back button is pressed', async () => {
    const user = userEvent.setup();
    const onBack = jest.fn();

    await renderWithProviders(
      <MessageDetailScreen
        message={labMessage}
        onBack={onBack}
      />,
    );

    await user.press(
      screen.getByRole('button', {
        name: 'Back to messages',
      }),
    );

    expect(onBack).toHaveBeenCalledTimes(1);
  });

  test('preserves the Reply prototype control', async () => {
    await renderWithProviders(
      <MessageDetailScreen
        message={generalMessage}
        onBack={jest.fn()}
      />,
    );

    expect(
      screen.getByRole('button', {
        name: 'Reply to message',
      }),
    ).toBeVisible();
  });
});