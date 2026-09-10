import {
  getMessageById,
  getMessages,
} from '../src/repositories/messagesRepository';

describe('messagesRepository', () => {
  test('returns the repository messages', () => {
    const messages = getMessages();

    expect(messages.length).toBeGreaterThan(0);
    expect(messages[0]).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        sender: expect.any(String),
        subject: expect.any(String),
      }),
    );
  });

  test('returns a message by id', () => {
    const messages = getMessages();
    const selectedMessage = getMessageById(messages[0].id);

    expect(selectedMessage).toEqual(messages[0]);
  });

  test('returns undefined when a message id does not exist', () => {
    expect(getMessageById('missing-message')).toBeUndefined();
  });
});