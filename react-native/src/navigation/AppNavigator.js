import { useState } from 'react';

import { DashboardScreen } from '../screens/DashboardScreen';
import { AccessibilitySettingsScreen } from '../screens/AccessibilitySettingsScreen';
import { SignInScreen } from '../screens/SignInScreen';
import { AppointmentsScreen } from '../screens/AppointmentsScreen';
import { AppointmentDetailScreen } from '../screens/AppointmentDetailScreen';

/**
 * Deliberately small prototype navigator. Feature PRs extend this single seam
 * as their concrete screens become available; no routing package is needed yet.
 */
export function AppNavigator() {
  const [route, setRoute] = useState({ name: 'sign-in' });

  if (route.name === 'dashboard') {
    return (
      <DashboardScreen
        onOpenAccessibility={() => setRoute({ name: 'accessibility' })}
        onOpenAppointments={() => setRoute({ name: 'appointments' })}
      />
    );
  }
  if (route.name === 'appointments') {
    return (
      <AppointmentsScreen
        onBack={() => setRoute({ name: 'dashboard' })}
        onHome={() => setRoute({ name: 'dashboard' })}
        onSelect={(appointment) =>
          setRoute({ name: 'appointment-detail', appointment })
        }
      />
    );
  }
  if (route.name === 'appointment-detail') {
    return (
      <AppointmentDetailScreen
        appointment={route.appointment}
        onBack={() => setRoute({ name: 'appointments' })}
      />
    );
  }

  if (route.name === 'accessibility') {
    return (
      <AccessibilitySettingsScreen
        onBack={() => setRoute({ name: 'dashboard' })}
      />
    );
  }

  return <SignInScreen onSignIn={() => setRoute({ name: 'dashboard' })} />;
}
