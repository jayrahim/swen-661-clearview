import {
  initialRoute,
  navigationActionTypes,
  navigationReducer,
  routeNames,
  rootTabRoutes,
} from '../src/navigation/routes';

describe('navigationReducer', () => {
  test('switches roots by replacing the active route', () => {
    const appointments = navigationReducer(initialRoute, {
      type: navigationActionTypes.openRoot,
      name: rootTabRoutes.visits,
    });
    const dashboard = navigationReducer(appointments, {
      type: navigationActionTypes.openRoot,
      name: rootTabRoutes.home,
    });

    expect(appointments).toEqual({ name: routeNames.appointments });
    expect(dashboard).toEqual({ name: routeNames.dashboard });
  });

  test('clears appointment detail when switching roots and does not duplicate roots', () => {
    const detail = navigationReducer(
      { name: routeNames.appointments },
      {
        type: navigationActionTypes.openAppointmentDetail,
        appointment: { id: 'appt-1' },
      },
    );
    const settings = navigationReducer(detail, {
      type: navigationActionTypes.openRoot,
      name: rootTabRoutes.settings,
    });
    const repeatedSettings = navigationReducer(settings, {
      type: navigationActionTypes.openRoot,
      name: rootTabRoutes.settings,
    });

    expect(settings).toEqual({ name: routeNames.settings });
    expect(repeatedSettings).toEqual({ name: routeNames.settings });
  });

  test('returns from appointment detail to its appointments parent', () => {
    const detail = navigationReducer(
      { name: routeNames.appointments },
      {
        type: navigationActionTypes.openAppointmentDetail,
        appointment: { id: 'appt-1' },
      },
    );

    expect(
      navigationReducer(detail, { type: navigationActionTypes.back }),
    ).toEqual({
      name: routeNames.appointments,
    });
  });
});
