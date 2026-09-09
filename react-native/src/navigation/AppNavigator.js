import { useState } from 'react';

import { DashboardScreen } from '../screens/DashboardScreen';
import { AccessibilitySettingsScreen } from '../screens/AccessibilitySettingsScreen';
import { SignInScreen } from '../screens/SignInScreen';

/**
 * Deliberately small prototype navigator. Feature PRs extend this single seam
 * as their concrete screens become available; no routing package is needed yet.
 */
export function AppNavigator() {
  const [screen, setScreen] = useState('sign-in');

  if (screen === 'dashboard') {
    return <DashboardScreen onOpenAccessibility={() => setScreen('accessibility')} />;
  }

  if (screen === 'accessibility') {
    return <AccessibilitySettingsScreen onBack={() => setScreen('dashboard')} />;
  }

  return <SignInScreen onSignIn={() => setScreen('dashboard')} />;
}
