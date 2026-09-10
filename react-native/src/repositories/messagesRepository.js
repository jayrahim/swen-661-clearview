
import { messages } from '../data/messagesData';

export function getMessages() {
  return messages;
}

export function getMessageById(id) {
  return messages.find((message) => message.id === id);
}