export const routeNames = Object.freeze({
  signIn: 'sign-in',
  dashboard: 'dashboard',
  appointments: 'appointments',
  messages: 'messages',
  records: 'records',
  settings: 'settings',
  appointmentDetail: 'appointment-detail',
});

export const rootRouteNames = Object.freeze([
  routeNames.dashboard,
  routeNames.appointments,
  routeNames.messages,
  routeNames.records,
  routeNames.settings,
]);

export const rootTabRoutes = Object.freeze({
  home: routeNames.dashboard,
  visits: routeNames.appointments,
  messages: routeNames.messages,
  records: routeNames.records,
  settings: routeNames.settings,
});

export const navigationActionTypes = Object.freeze({
  signInComplete: 'sign-in-complete',
  openRoot: 'open-root',
  openAppointmentDetail: 'open-appointment-detail',
  back: 'back',
});

export const initialRoute = Object.freeze({ name: routeNames.signIn });

export function navigationReducer(route, action) {
  switch (action.type) {
    case navigationActionTypes.signInComplete:
      return { name: routeNames.dashboard };
    case navigationActionTypes.openRoot:
      if (!rootRouteNames.includes(action.name)) return route;
      // Replacing the route clears any active child detail route.
      return { name: action.name };
    case navigationActionTypes.openAppointmentDetail:
      return {
        name: routeNames.appointmentDetail,
        appointment: action.appointment,
      };
    case navigationActionTypes.back:
      if (route.name === routeNames.appointmentDetail) {
        return { name: routeNames.appointments };
      }
      return route;
    default:
      return route;
  }
}
