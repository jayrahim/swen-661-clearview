import { colors } from '../theme/tokens';

export const nextAppointment = Object.freeze({
  clinicianName: 'Dr. Elena Martinez',
  dateTime: 'Sep 4 • 10:30 AM',
  location: 'Cardiology • Main Campus',
  status: 'Confirmed',
});

export const quickAccessItems = Object.freeze([
  {
    id: 'messages',
    title: 'Messages',
    backgroundColor: colors.blueTile,
    subtitleColor: '#00679D',
  },
  {
    id: 'medical-notes',
    title: 'Medical notes',
    subtitle: '3 recent',
    backgroundColor: colors.aqua,
    subtitleColor: colors.primary,
  },
  {
    id: 'prescriptions',
    title: 'Prescriptions',
    subtitle: '4 active',
    backgroundColor: colors.warning,
    subtitleColor: colors.warningInk,
  },
  {
    id: 'referrals',
    title: 'Referrals',
    subtitle: '1 pending',
    backgroundColor: colors.purpleTile,
    subtitleColor: '#67477D',
  },
]);
