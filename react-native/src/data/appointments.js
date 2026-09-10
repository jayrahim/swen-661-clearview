export const appointmentStatus = Object.freeze({
  confirmed: 'Confirmed',
  needsAction: 'Needs action',
});

const appointments = Object.freeze(
  [
    {
      id: 'appt-1',
      clinicianName: 'Dr. Elena Martinez',
      specialty: 'Cardiology',
      location: 'Main Campus',
      locationDetail: 'Building B, Floor 2',
      scheduledAt: new Date(2026, 8, 4, 10, 30),
      status: appointmentStatus.confirmed,
      visitType: 'In-person follow-up',
      preparationNote:
        'Bring your medication list and arrive 15 minutes early.',
    },
    {
      id: 'appt-2',
      clinicianName: 'Dr. David Chen',
      specialty: 'Primary Care',
      location: 'Telehealth',
      scheduledAt: new Date(2026, 8, 18, 14),
      status: appointmentStatus.confirmed,
      visitType: 'Virtual follow-up',
      preparationNote:
        'Join from a quiet place five minutes before your visit.',
    },
    {
      id: 'appt-3',
      clinicianName: 'Vision Center',
      specialty: 'Ophthalmology',
      location: 'North Clinic',
      scheduledAt: new Date(2026, 9, 2, 9, 15),
      status: appointmentStatus.needsAction,
      visitType: 'In-person appointment',
      preparationNote: 'Please contact the clinic to confirm this appointment.',
    },
  ].map(Object.freeze),
);

/** Synthetic read-only data source used until a service-backed repository exists. */
export const appointmentRepository = Object.freeze({
  // Return a new collection so callers cannot alter the repository's ordering.
  getAll: () => [...appointments],
  getById: (id) => appointments.find((item) => item.id === id),
});
