import { screen, userEvent } from '@testing-library/react-native';
import { AppointmentsScreen } from '../src/screens/AppointmentsScreen';
import { AppointmentDetailScreen } from '../src/screens/AppointmentDetailScreen';
import { appointmentRepository } from '../src/data/appointments';
import { defaultAccessibilityPreferences } from '../src/state/accessibilityPreferences';
import { renderWithProviders } from '../src/test-utils/renderWithProviders';
import {
  layout,
  resolveTheme,
  scaledFontSize,
  spacing,
} from '../src/theme/tokens';

describe('appointmentRepository', () => {
  test('returns ordered synthetic appointments without exposing its collection', () => {
    const firstRead = appointmentRepository.getAll();
    const secondRead = appointmentRepository.getAll();

    expect(firstRead).toHaveLength(3);
    expect(firstRead.map(({ id }) => id)).toEqual([
      'appt-1',
      'appt-2',
      'appt-3',
    ]);
    expect(secondRead).not.toBe(firstRead);

    firstRead.pop();
    expect(appointmentRepository.getAll()).toHaveLength(3);
  });

  test('finds an appointment by its stable id and returns undefined for an unknown id', () => {
    expect(appointmentRepository.getById('appt-2')).toMatchObject({
      clinicianName: 'Dr. David Chen',
      visitType: 'Virtual follow-up',
    });
    expect(appointmentRepository.getById('missing')).toBeUndefined();
  });
});

test('list renders repository data and selects the intended appointment', async () => {
  const user = userEvent.setup();
  const onSelect = jest.fn();

  await renderWithProviders(
    <AppointmentsScreen onNavigate={{ home: jest.fn() }} onSelect={onSelect} />,
  );

  expect(screen.getByRole('header', { name: 'Appointments' })).toBeVisible();
  expect(
    screen.getByRole('button', {
      name: 'Dr. Elena Martinez, Cardiology, Confirmed',
    }),
  ).toBeVisible();
  expect(
    screen.getByRole('button', {
      name: 'Vision Center, Ophthalmology, Needs action',
    }),
  ).toBeVisible();
  await user.press(
    screen.getByRole('button', {
      name: 'Dr. David Chen, Primary Care, Confirmed',
    }),
  );

  expect(onSelect).toHaveBeenCalledWith(
    appointmentRepository.getById('appt-2'),
  );

  await user.press(
    screen.getByRole('button', { name: 'Schedule Appointment' }),
  );
  expect(
    screen.getByRole('button', { name: 'Schedule Appointment' }),
  ).toHaveProp(
    'accessibilityHint',
    'Scheduling is not available in this prototype',
  );
  expect(
    screen.getByText('Scheduling is not available in this prototype.'),
  ).toBeVisible();
  expect(
    screen.getByText('Scheduling is not available in this prototype.').parent,
  ).toHaveStyle({ bottom: layout.bottomNavigationHeight + spacing.md });
});

test('list uses the high-contrast badge treatment', async () => {
  await renderWithProviders(
    <AppointmentsScreen
      onNavigate={{ home: jest.fn() }}
      onSelect={jest.fn()}
    />,
    {
      initialPreferences: {
        ...defaultAccessibilityPreferences,
        highContrast: true,
      },
    },
  );

  expect(screen.getByText('SEP 4').parent).toHaveStyle({
    backgroundColor: '#FFFFFF',
    borderColor: '#111827',
    borderWidth: 2,
  });
});

test('detail shows selected data and prototype feedback', async () => {
  const user = userEvent.setup();
  await renderWithProviders(
    <AppointmentDetailScreen
      appointment={appointmentRepository.getById('appt-2')}
      onBack={jest.fn()}
    />,
  );

  expect(screen.getByText('Primary Care visit')).toBeVisible();
  expect(screen.getByText('Telehealth')).toBeVisible();
  expect(screen.getByText('Virtual follow-up')).toBeVisible();
  expect(
    screen.getByText('Join from a quiet place five minutes before your visit.'),
  ).toBeVisible();
  await user.press(screen.getByRole('button', { name: 'Get directions' }));

  expect(
    screen.getByText('Directions are not available in this prototype.'),
  ).toBeVisible();
  await user.press(screen.getByRole('button', { name: 'Reschedule' }));
  expect(
    screen.getByText('Rescheduling is not available in this prototype.'),
  ).toBeVisible();
});

test('detail applies high-contrast borders and the selected text scale', async () => {
  const preferences = {
    ...defaultAccessibilityPreferences,
    highContrast: true,
    textSize: { id: 'extra-large', label: 'Extra large', scale: 1.15 },
  };
  const theme = resolveTheme(preferences);

  await renderWithProviders(
    <AppointmentDetailScreen
      appointment={appointmentRepository.getById('appt-1')}
      onBack={jest.fn()}
    />,
    {
      initialPreferences: preferences,
    },
  );

  expect(
    screen.getByRole('header', { name: 'Appointment Details' }),
  ).toHaveStyle({
    color: '#111827',
    fontSize: scaledFontSize(24, theme),
  });
  expect(screen.getByText('Date & time').parent).toHaveStyle({
    borderBottomWidth: 2,
    borderColor: '#111827',
  });
  expect(screen.getByText('Before your visit').parent).toHaveStyle({
    backgroundColor: '#FFFFFF',
    borderColor: '#111827',
    borderWidth: 2,
  });
  expect(screen.getByRole('button', { name: 'Reschedule' })).toHaveStyle({
    borderWidth: 2,
  });
  expect(screen.getByText('Get directions')).toHaveStyle({
    fontSize: scaledFontSize(16, theme),
  });
});
