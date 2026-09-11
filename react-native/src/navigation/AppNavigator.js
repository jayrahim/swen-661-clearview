import { useMemo, useReducer } from 'react';

import { AccessibilitySettingsScreen } from '../screens/AccessibilitySettingsScreen';
import { AppointmentDetailScreen } from '../screens/AppointmentDetailScreen';
import { AppointmentsScreen } from '../screens/AppointmentsScreen';
import { DashboardScreen } from '../screens/DashboardScreen';
import { MessageDetailScreen } from '../screens/MessageDetailScreen';
import { MessagesScreen } from '../screens/MessagesScreen';
import { SignInScreen } from '../screens/SignInScreen';
import {
  initialRoute,
  navigationActionTypes,
  navigationReducer,
  routeNames,
  rootTabRoutes,
} from './routes';

export function AppNavigator() {
  const [route, dispatch] = useReducer(navigationReducer, initialRoute);

  const rootNavigation = useMemo(
    () => ({
      // Records remains intentionally omitted until its route exists.
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

      messages: () =>
        dispatch({
          type: navigationActionTypes.openRoot,
          name: rootTabRoutes.messages,
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

  if (route.name === routeNames.messages) {
    return (
      <MessagesScreen
        onNavigate={rootNavigation}
        onSelectMessage={(message) =>
          dispatch({
            type: navigationActionTypes.openMessageDetail,
            message,
          })
        }
      />
    );
  }

  if (route.name === routeNames.messageDetail) {
    return (
      <MessageDetailScreen
        message={route.message}
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
