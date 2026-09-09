import { useState } from 'react';

import { DashboardScreen } from '../screens/DashboardScreen';
import { SignInScreen } from '../screens/SignInScreen';

/**
 * Deliberately small prototype navigator. Feature PRs extend this single seam
 * as their concrete screens become available; no routing package is needed yet.
 */
export function AppNavigator() {
  const [screen, setScreen] = useState('sign-in');

  if (screen === 'dashboard') {
    return <DashboardScreen />;
  }

  return <SignInScreen onSignIn={() => setScreen('dashboard')} />;
}
