import { useState } from 'react';

import { DashboardScreen } from '../screens/DashboardScreen';
import { MessageDetailScreen } from '../screens/MessageDetailScreen';
import { MessagesScreen } from '../screens/MessagesScreen';
import { SignInScreen } from '../screens/SignInScreen';


export function AppNavigator() {
  const [screen, setScreen] = useState('sign-in');
  const [selectedMessage, setSelectedMessage] = useState(null);

  if (screen === 'dashboard') {
    return (
      <DashboardScreen
        onMessages={() => setScreen('messages')}
      />
    );
  }

  if (screen === 'messages') {
    return (
      <MessagesScreen
        onHome={() => setScreen('dashboard')}
        onSelectMessage={(message) => {
          setSelectedMessage(message);
          setScreen('message-detail');
        }}
      />
    );
  }

  if (screen === 'message-detail' && selectedMessage) {
    return (
      <MessageDetailScreen
        message={selectedMessage}
        onBack={() => setScreen('messages')}
      />
    );
  }

  return <SignInScreen onSignIn={() => setScreen('dashboard')} />;
}