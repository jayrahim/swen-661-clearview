import { screen, userEvent } from '@testing-library/react-native';

import { MessageDetailScreen } from '../src/screens/MessageDetailScreen';
import {
  defaultAccessibilityPreferences,
  textSizeOptions,
} from '../src/state/accessibilityPreferences';
import { renderWithProviders } from '../src/test-utils/renderWithProviders';

const labMessage = {
  id: 'msg-1',
  sender: 'Dr. David Chen',
  subject: 'Your lab results are available',
  preview: 'Your recent blood work is now available in CareConnect.',
  sentAt: new Date(2026, 7, 27, 8, 42),
  isRead: false,
  body:
    'Hi Maya,\n\n' +
    'Your recent blood work is now available in CareConnect. ' +
    'Most results are within the expected range. I added a note ' +
    'about your vitamin D level and would like you to review it ' +
    'before our next visit.',
  statusMessage: '✓ Results reviewed by care team',
  statusDetail: 'No urgent follow-up is required.',
  showLabResultsAction: true,
};

const generalMessage = {
  id: 'msg-2',
  sender: 'Care Team',
  subject: 'Reminder: upcoming appointment',
  preview: 'You have an upcoming appointment.',
  sentAt: new Date(2026, 7, 26, 16, 10),
  isRead: false,
  body: null,
  statusMessage: null,
  statusDetail: null,
  showLabResultsAction: false,
};

describe('MessageDetailScreen', () => {
  test('renders the selected message details', async () => {
    await renderWithProviders(
      <MessageDetailScreen message={labMessage} onBack={jest.fn()} />,
    );

    expect(screen.getByRole('header', { name: 'Message' })).toBeVisible();
    expect(screen.getByText('Dr. David Chen')).toBeVisible();
    expect(screen.getByText('Aug 27 • 8:42 AM')).toBeVisible();
    expect(screen.getByText('Your lab results are available')).toBeVisible();
    expect(screen.getByText(labMessage.body)).toBeVisible();

    expect(
      screen.getByLabelText(
        '✓ Results reviewed by care team. No urgent follow-up is required.',
      ),
    ).toBeVisible();
  });

  test('shows the lab-results action when enabled by the message', async () => {
    await renderWithProviders(
      <MessageDetailScreen message={labMessage} onBack={jest.fn()} />,
    );

    expect(
      screen.getByRole('button', {
        name: 'View lab results',
      }),
    ).toBeVisible();
  });

  test('does not show the lab-results action when disabled by the message', async () => {
    await renderWithProviders(
      <MessageDetailScreen message={generalMessage} onBack={jest.fn()} />,
    );

    expect(
      screen.queryByRole('button', {
        name: 'View lab results',
      }),
    ).toBeNull();
  });

  test('shows the approved prototype feedback when View lab results is pressed', async () => {
    const user = userEvent.setup();

    await renderWithProviders(
      <MessageDetailScreen message={labMessage} onBack={jest.fn()} />,
    );

    await user.press(
      screen.getByRole('button', {
        name: 'View lab results',
      }),
    );

    expect(
      screen.getByText('Lab results are not available in this prototype.'),
    ).toBeVisible();
  });

  test('shows the approved prototype feedback when Reply is pressed', async () => {
    const user = userEvent.setup();

    await renderWithProviders(
      <MessageDetailScreen message={generalMessage} onBack={jest.fn()} />,
    );

    await user.press(
      screen.getByRole('button', {
        name: 'Reply to message',
      }),
    );

    expect(
      screen.getByText('Reply is not available in this prototype.'),
    ).toBeVisible();
  });

  test('returns to Messages when the back button is pressed', async () => {
    const user = userEvent.setup();
    const onBack = jest.fn();

    await renderWithProviders(
      <MessageDetailScreen message={labMessage} onBack={onBack} />,
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
      <MessageDetailScreen message={generalMessage} onBack={jest.fn()} />,
    );

    expect(
      screen.getByRole('button', {
        name: 'Reply to message',
      }),
    ).toBeVisible();
  });

  test('uses the enlarged text preference for Message Detail typography', async () => {
    await renderWithProviders(
      <MessageDetailScreen message={labMessage} onBack={jest.fn()} />,
      {
        initialPreferences: {
          ...defaultAccessibilityPreferences,
          textSize: textSizeOptions[2],
        },
      },
    );

    const header = screen.getByRole('header', { name: 'Message' });
    const sender = screen.getByText('Dr. David Chen');
    const subject = screen.getByText('Your lab results are available');
    const date = screen.getByText('Aug 27 • 8:42 AM');
    const reply = screen.getByText('Reply');

    expect(header.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          fontSize: 27.599999999999998,
        }),
      ]),
    );

    expect(sender.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          fontSize: 18.4,
        }),
      ]),
    );

    expect(subject.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          fontSize: 27.599999999999998,
        }),
      ]),
    );

    expect(date.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          fontSize: 16.099999999999998,
        }),
      ]),
    );

    expect(reply.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          fontSize: 18.4,
        }),
      ]),
    );
  });
});
