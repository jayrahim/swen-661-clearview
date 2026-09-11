import {
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';

import { AppCard } from '../components/AppCard';
import { BottomNavigation } from '../components/BottomNavigation';
import { QuickAccessTile } from '../components/QuickAccessTile';
import { ScreenContainer } from '../components/ScreenContainer';
import { nextAppointment, quickAccessItems } from '../data/dashboardData';
import { colors, scaledFontSize, spacing, typography } from '../theme/tokens';
import { useClearViewTheme } from '../theme/useClearViewTheme';
import { getUnreadMessageCount } from '../repositories/messagesRepository';

export function DashboardScreen({ onNavigate = {} }) {
  const { width } = useWindowDimensions();
  const isTablet = width >= 600;
  const { preferences, theme } = useClearViewTheme();
  const unreadMessageCount = getUnreadMessageCount();

  return (
    <View style={[styles.screen, { backgroundColor: theme.colors.background }]}>
      <ScreenContainer>
        <View style={styles.content}>
          <View style={styles.header}>
            <Text
              accessibilityRole="header"
              style={[styles.greeting, { fontSize: scaledFontSize(23, theme) }]}
            >
              Good morning, Maya
            </Text>
            <Pressable
              accessibilityLabel="Accessibility settings"
              accessibilityRole="button"
              onPress={onNavigate.settings}
              style={styles.accessibilityShortcut}
            >
              <Text style={styles.accessibilityLabel}>Accessibility</Text>
            </Pressable>
          </View>

          <Text style={[styles.date, { fontSize: scaledFontSize(16, theme) }]}>
            Thursday, August 27
          </Text>

          <Pressable
            accessibilityLabel="View appointment details"
            accessibilityRole="button"
            onPress={onNavigate.visits}
          >
            <AppCard>
              <View style={styles.appointmentHeader}>
                <Text style={styles.nextAppointment}>Next appointment</Text>
                <View
                  accessible
                  accessibilityLabel="Confirmed"
                  style={styles.statusPill}
                >
                  <Text style={styles.statusLabel}>
                    {nextAppointment.status}
                  </Text>
                </View>
              </View>
              <Text style={styles.clinician}>
                {nextAppointment.clinicianName}
              </Text>
              <Text style={styles.appointmentTime}>
                {nextAppointment.dateTime}
              </Text>
              <Text style={styles.appointmentLocation}>
                {nextAppointment.location}
              </Text>
              <Text style={styles.viewDetails}>View details →</Text>
            </AppCard>
          </Pressable>

          <Text accessibilityRole="header" style={styles.sectionTitle}>
            Quick access
          </Text>

          {!preferences.reducedClutter && (
            <View style={isTablet ? styles.tabletTiles : styles.phoneTiles}>
              {quickAccessItems.map((item) => {
                const displayItem =
                  item.id === 'messages'
                    ? {
                        ...item,
                        subtitle: `${unreadMessageCount} unread`,
                      }
                    : item;

                return (
                  <QuickAccessTile
                    item={displayItem}
                    key={item.id}
                    onPress={
                      item.id === 'messages' ? onNavigate.messages : undefined
                    }
                    style={isTablet ? styles.tabletTile : styles.phoneTile}
                  />
                );
              })}
            </View>
          )}

          <Pressable
            accessibilityLabel="Accessibility preferences"
            accessibilityRole="button"
            onPress={onNavigate.settings}
          >
            <AppCard style={styles.preferencesCard}>
              <View style={styles.preferencesContent}>
                <View>
                  <Text style={styles.preferencesTitle}>
                    Accessibility preferences
                  </Text>

                  <Text
                    style={[
                      styles.preferencesDetail,
                      { fontSize: scaledFontSize(14, theme) },
                    ]}
                  >
                    Text: {preferences.textSize.label} • High contrast:{' '}
                    {preferences.highContrast ? 'On' : 'Off'}
                  </Text>
                </View>

                <Text accessibilityElementsHidden style={styles.chevron}>
                  ›
                </Text>
              </View>
            </AppCard>
          </Pressable>
        </View>
      </ScreenContainer>
      <BottomNavigation activeItem="home" onNavigate={onNavigate} />
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
  accessibilityShortcut: { minHeight: 48, justifyContent: 'center' },
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
