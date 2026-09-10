import { useMemo, useReducer } from 'react';

import { DashboardScreen } from '../screens/DashboardScreen';
import { AccessibilitySettingsScreen } from '../screens/AccessibilitySettingsScreen';
import { SignInScreen } from '../screens/SignInScreen';
import { AppointmentsScreen } from '../screens/AppointmentsScreen';
import { AppointmentDetailScreen } from '../screens/AppointmentDetailScreen';
import {
  initialRoute,
  navigationActionTypes,
  navigationReducer,
  routeNames,
  rootTabRoutes,
} from './routes';

/**
 * Deliberately small prototype navigator. Feature PRs extend this single seam
 * as their concrete screens become available; no routing package is needed yet.
 */
export function AppNavigator() {
  const [route, dispatch] = useReducer(navigationReducer, initialRoute);
  const rootNavigation = useMemo(
    () => ({
      // Messages and Records remain intentionally omitted until their routes exist.
      home: () =>
        dispatch({
          type: navigationActionTypes.openRoot,
          name: rootTabRoutes.home,
        }),
      visits: () =>
        dispatch({
          type: navigationActionTypes.openRoot,
          name: rootTabRoutes.visits,
        }),
      settings: () =>
        dispatch({
          type: navigationActionTypes.openRoot,
          name: rootTabRoutes.settings,
        }),
    }),
    [],
  );

  if (route.name === routeNames.dashboard) {
    return <DashboardScreen onNavigate={rootNavigation} />;
  }
  if (route.name === routeNames.appointments) {
    return (
      <AppointmentsScreen
        onNavigate={rootNavigation}
        onSelect={(appointment) =>
          dispatch({
            type: navigationActionTypes.openAppointmentDetail,
            appointment,
          })
        }
      />
    );
  }
  if (route.name === routeNames.appointmentDetail) {
    return (
      <AppointmentDetailScreen
        appointment={route.appointment}
        onBack={() => dispatch({ type: navigationActionTypes.back })}
      />
    );
  }

  if (route.name === routeNames.settings) {
    return <AccessibilitySettingsScreen onNavigate={rootNavigation} />;
  }

  return (
    <SignInScreen
      onSignIn={() => dispatch({ type: navigationActionTypes.signInComplete })}
    />
  );
}
