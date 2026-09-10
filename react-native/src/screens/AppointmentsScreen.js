import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { BottomNavigation } from '../components/BottomNavigation';
import { AppCard } from '../components/AppCard';
import { SafeAreaScreen } from '../components/SafeAreaScreen';
import { appointmentRepository } from '../data/appointments';
import { appointmentBadge, appointmentTime } from '../utils/appointmentFormat';
import { colors, scaledFontSize } from '../theme/tokens';
import { useClearViewTheme } from '../theme/useClearViewTheme';

export function AppointmentsScreen({ onNavigate = {}, onSelect }) {
  const { preferences, theme } = useClearViewTheme();
  const appointments = appointmentRepository.getAll();

  return (
    <SafeAreaScreen
      style={[styles.screen, { backgroundColor: theme.colors.background }]}
    >
      <ScrollView contentContainerStyle={styles.content}>
        <Text
          accessibilityRole="header"
          style={[
            styles.title,
            { color: theme.colors.ink, fontSize: scaledFontSize(24, theme) },
          ]}
        >
          Appointments
        </Text>
        <Text
          accessibilityRole="header"
          style={[
            styles.heading,
            { color: theme.colors.ink, fontSize: scaledFontSize(20, theme) },
          ]}
        >
          Upcoming
        </Text>
        {appointments.map((item) => (
          <Pressable
            accessibilityLabel={`${item.clinicianName}, ${item.specialty}, ${item.status}`}
            accessibilityRole="button"
            key={item.id}
            onPress={() => onSelect(item)}
          >
            <AppCard style={styles.card}>
              <View style={styles.row}>
                <View
                  style={[
                    styles.badge,
                    {
                      backgroundColor: preferences.highContrast
                        ? theme.colors.surface
                        : colors.aqua,
                      borderColor: theme.colors.border,
                      borderWidth: theme.borderWidth,
                    },
                  ]}
                >
                  <Text
                    style={[styles.badgeDate, { color: theme.colors.primary }]}
                  >
                    {appointmentBadge(item.scheduledAt)}
                  </Text>
                  <Text style={[styles.badgeTime, { color: theme.colors.ink }]}>
                    {appointmentTime(item.scheduledAt)}
                  </Text>
                </View>
                <View style={styles.details}>
                  <Text
                    style={[
                      styles.clinician,
                      {
                        color: theme.colors.ink,
                        fontSize: scaledFontSize(18, theme),
                      },
                    ]}
                  >
                    {item.clinicianName}
                  </Text>
                  <Text
                    style={[styles.muted, { color: theme.colors.mutedInk }]}
                  >
                    {item.specialty} • {item.location}
                  </Text>
                  <Text style={styles.status}>{item.status}</Text>
                  <Text style={[styles.link, { color: theme.colors.primary }]}>
                    View details ›
                  </Text>
                </View>
              </View>
            </AppCard>
          </Pressable>
        ))}
      </ScrollView>
      <BottomNavigation activeItem="visits" onNavigate={onNavigate} />
    </SafeAreaScreen>
  );
}
const styles = StyleSheet.create({
  screen: { backgroundColor: colors.background },
  content: { padding: 18 },
  title: { fontSize: 24, fontWeight: '700' },
  heading: { fontSize: 20, fontWeight: '700', marginTop: 28, marginBottom: 16 },
  card: { marginBottom: 18 },
  row: { flexDirection: 'row' },
  badge: {
    alignItems: 'center',
    backgroundColor: colors.aqua,
    borderRadius: 10,
    minWidth: 74,
    padding: 10,
  },
  badgeDate: { color: colors.primary, fontWeight: '700' },
  badgeTime: { color: colors.ink, fontWeight: '700', marginTop: 8 },
  details: { flex: 1, marginLeft: 16 },
  clinician: { color: colors.ink, fontSize: 18, fontWeight: '700' },
  muted: { color: colors.mutedInk, marginTop: 7 },
  status: { color: colors.mintInk, fontWeight: '700', marginTop: 14 },
  link: { color: colors.primary, fontWeight: '700', marginTop: 10 },
});
