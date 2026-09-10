import { StyleSheet, Text, useWindowDimensions, View } from 'react-native';

import { AppCard } from '../components/AppCard';
import { BottomNavigation } from '../components/BottomNavigation';
import { QuickAccessTile } from '../components/QuickAccessTile';
import { ScreenContainer } from '../components/ScreenContainer';
import { nextAppointment, quickAccessItems } from '../data/dashboardData';
import { colors, spacing, typography } from '../theme/tokens';

export function DashboardScreen({ onMessages }) {
  const { width } = useWindowDimensions();
  const isTablet = width >= 600;

  return (
    <View style={styles.screen}>
      <ScreenContainer>
        <View style={styles.content}>
          <View style={styles.header}>
            <Text accessibilityRole="header" style={styles.greeting}>
              Good morning, Maya
            </Text>
            <Text style={styles.accessibilityLabel}>Accessibility</Text>
          </View>

          <Text style={styles.date}>Thursday, August 27</Text>

          <AppCard>
            <View style={styles.appointmentHeader}>
              <Text style={styles.nextAppointment}>Next appointment</Text>
              <View accessible accessibilityLabel="Confirmed" style={styles.statusPill}>
                <Text style={styles.statusLabel}>{nextAppointment.status}</Text>
              </View>
            </View>
            <Text style={styles.clinician}>{nextAppointment.clinicianName}</Text>
            <Text style={styles.appointmentTime}>{nextAppointment.dateTime}</Text>
            <Text style={styles.appointmentLocation}>{nextAppointment.location}</Text>
            <Text style={styles.viewDetails}>View details →</Text>
          </AppCard>

          <Text accessibilityRole="header" style={styles.sectionTitle}>
            Quick access
          </Text>
          <View style={isTablet ? styles.tabletTiles : styles.phoneTiles}>
            {quickAccessItems.map((item) => (
               <QuickAccessTile
                  item={item}
                  key={item.id}
                  onPress={item.id === 'messages' ? onMessages : undefined}
                  style={isTablet ? styles.tabletTile : styles.phoneTile}
              />
))}
          </View>

          <AppCard style={styles.preferencesCard}>
            <View style={styles.preferencesContent}>
              <View>
                <Text style={styles.preferencesTitle}>Accessibility preferences</Text>
                <Text style={styles.preferencesDetail}>Text: Large • High contrast: On</Text>
              </View>
              <Text accessibilityElementsHidden style={styles.chevron}>
                ›
              </Text>
            </View>
          </AppCard>
        </View>
      </ScreenContainer>
      <BottomNavigation activeItem="home" onNavigate={{messages: onMessages,}}  
/>
    </View>
  );
}

const styles = StyleSheet.create({
  accessibilityLabel: {
    color: colors.primary,
    fontSize: typography.body,
    fontWeight: '700',
    marginTop: spacing.xs,
  },
  appointmentHeader: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  appointmentLocation: {
    color: colors.mutedInk,
    fontSize: typography.body,
    marginTop: spacing.sm,
  },
  appointmentTime: {
    color: colors.ink,
    fontSize: 18,
    fontWeight: '700',
    marginTop: spacing.sm,
  },
  chevron: {
    color: colors.primary,
    fontSize: 32,
    fontWeight: '700',
  },
  clinician: {
    color: colors.ink,
    fontSize: typography.heading,
    fontWeight: '700',
    marginTop: spacing.sm,
  },
  content: {
    paddingHorizontal: 18,
    paddingTop: 28,
    paddingBottom: spacing.xxl,
  },
  date: {
    color: colors.mutedInk,
    fontSize: typography.body,
    marginTop: 28,
  },
  greeting: {
    color: colors.ink,
    flex: 1,
    fontSize: 23,
    fontWeight: '700',
  },
  header: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  nextAppointment: {
    color: colors.primary,
    fontSize: typography.label,
    fontWeight: '700',
  },
  phoneTile: {
    marginBottom: spacing.lg,
    width: '48%',
  },
  phoneTiles: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  preferencesCard: {
    marginTop: 26,
  },
  preferencesContent: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  preferencesDetail: {
    color: colors.mutedInk,
    fontSize: typography.label,
    marginTop: spacing.sm,
  },
  preferencesTitle: {
    color: colors.ink,
    fontSize: typography.body,
    fontWeight: '700',
  },
  screen: {
    backgroundColor: colors.background,
    flex: 1,
  },
  sectionTitle: {
    color: colors.ink,
    fontSize: 21,
    fontWeight: '700',
    marginTop: 26,
    marginBottom: spacing.lg,
  },
  statusLabel: {
    color: colors.mintInk,
    fontSize: typography.label,
    fontWeight: '700',
  },
  statusPill: {
    backgroundColor: colors.mint,
    borderRadius: 20,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  tabletTile: {
    marginBottom: spacing.lg,
    width: '23.5%',
  },
  tabletTiles: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  viewDetails: {
    color: colors.primary,
    fontSize: typography.body,
    fontWeight: '700',
    marginTop: spacing.sm,
  },
});
