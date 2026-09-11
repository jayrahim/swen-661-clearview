import { screen, userEvent } from '@testing-library/react-native';

import { getUnreadMessageCount } from '../src/repositories/messagesRepository';
import { MessagesScreen } from '../src/screens/MessagesScreen';
import {
  defaultAccessibilityPreferences,
  textSizeOptions,
} from '../src/state/accessibilityPreferences';
import { renderWithProviders } from '../src/test-utils/renderWithProviders';

describe('MessagesScreen', () => {
  test('renders the Flutter-aligned Messages list and unread summary', async () => {
    await renderWithProviders(<MessagesScreen onSelectMessage={jest.fn()} />);

    expect(screen.getByRole('header', { name: 'Messages' })).toBeVisible();

    expect(
      screen.getByLabelText(`${getUnreadMessageCount()} unread messages`),
    ).toBeVisible();

    expect(screen.getByLabelText('User profile')).toBeVisible();

    expect(screen.getByText('Dr. David Chen')).toBeVisible();
    expect(screen.getByText('Your lab results are available')).toBeVisible();

    expect(screen.getByText('Care Team')).toBeVisible();
    expect(screen.getByText('Reminder: upcoming appointment')).toBeVisible();

    expect(screen.getByText('Vision Center')).toBeVisible();
    expect(screen.getByText('Referral received')).toBeVisible();

    expect(screen.getByText('Billing Support')).toBeVisible();
    expect(screen.getByText('Statement available')).toBeVisible();
  });

  test('passes the selected message when a message is pressed', async () => {
    const user = userEvent.setup();
    const onSelectMessage = jest.fn();

    await renderWithProviders(
      <MessagesScreen onSelectMessage={onSelectMessage} />,
    );

    await user.press(
      screen.getByRole('button', {
        name: /Unread message from Dr\. David Chen\. Your lab results are available/,
      }),
    );

    expect(onSelectMessage).toHaveBeenCalledTimes(1);

    expect(onSelectMessage).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 'msg-1',
        sender: 'Dr. David Chen',
        subject: 'Your lab results are available',
        isRead: false,
        showLabResultsAction: true,
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

  test('uses the enlarged text preference for Messages typography', async () => {
    await renderWithProviders(<MessagesScreen onSelectMessage={jest.fn()} />, {
      initialPreferences: {
        ...defaultAccessibilityPreferences,
        textSize: textSizeOptions[2],
      },
    });

    const title = screen.getByRole('header', { name: 'Messages' });
    const sender = screen.getByText('Dr. David Chen');
    const subject = screen.getByText('Your lab results are available');
    const date = screen.getByText('Aug 27 • 8:42 AM');

    expect(title.props.style).toEqual(
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
          fontSize: 18.4,
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
  });
});
