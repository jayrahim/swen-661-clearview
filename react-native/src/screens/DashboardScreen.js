import { Pressable, StyleSheet, Text, View } from 'react-native';

import { AppCard } from '../components/AppCard';
import {
  PrototypeFeedbackAnchor,
  usePrototypeFeedback,
} from '../components/PrototypeFeedback';
import { QuickAccessTile } from '../components/QuickAccessTile';
import {
  RootScreenLayout,
  rootNavigationFeedbackOffset,
} from '../components/RootScreenLayout';
import { ScreenContainer } from '../components/ScreenContainer';
import { nextAppointment, quickAccessItems } from '../data/dashboardData';
import { useResponsiveLayout } from '../layout/useResponsiveLayout';
import { colors, scaledFontSize, spacing, typography } from '../theme/tokens';
import { useClearViewTheme } from '../theme/useClearViewTheme';
import { getUnreadMessageCount } from '../repositories/messagesRepository';

const quickAccessFeedback = {
  prescriptions: 'Prescriptions are not available in this prototype.',
  referrals: 'Referrals are not available in this prototype.',
};

export function DashboardScreen({ onNavigate = {} }) {
  const { isTablet } = useResponsiveLayout();
  const { preferences, theme } = useClearViewTheme();
  const { showPrototypeFeedback } = usePrototypeFeedback();
  const unreadMessageCount = getUnreadMessageCount();

  return (
    <RootScreenLayout
      activeItem="home"
      onNavigate={onNavigate}
      style={{ backgroundColor: theme.colors.background }}
    >
      <PrototypeFeedbackAnchor
        bottomOffset={rootNavigationFeedbackOffset(isTablet) + spacing.md}
      />
      <ScreenContainer safeArea={false}>
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
              <Text
                style={[
                  styles.accessibilityLabel,
                  {
                    color: theme.colors.primary,
                    fontSize: scaledFontSize(16, theme),
                  },
                ]}
              >
                Accessibility
              </Text>
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
                <Text
                  style={[
                    styles.nextAppointment,
                    {
                      color: theme.colors.primary,
                      fontSize: scaledFontSize(14, theme),
                    },
                  ]}
                >
                  Next appointment
                </Text>
                <View
                  accessible
                  accessibilityLabel="Confirmed"
                  style={[
                    styles.statusPill,
                    {
                      backgroundColor: theme.isHighContrast
                        ? theme.colors.surface
                        : colors.mint,
                      borderColor: theme.colors.primary,
                      borderWidth: theme.isHighContrast ? theme.borderWidth : 0,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.statusLabel,
                      {
                        color: theme.isHighContrast
                          ? theme.colors.primary
                          : colors.mintInk,
                        fontSize: scaledFontSize(14, theme),
                      },
                    ]}
                  >
                    {nextAppointment.status}
                  </Text>
                </View>
              </View>
              <Text
                style={[
                  styles.clinician,
                  {
                    color: theme.colors.ink,
                    fontSize: scaledFontSize(20, theme),
                  },
                ]}
              >
                {nextAppointment.clinicianName}
              </Text>
              <Text
                style={[
                  styles.appointmentTime,
                  {
                    color: theme.colors.ink,
                    fontSize: scaledFontSize(18, theme),
                  },
                ]}
              >
                {nextAppointment.dateTime}
              </Text>
              <Text
                style={[
                  styles.appointmentLocation,
                  {
                    color: theme.colors.mutedInk,
                    fontSize: scaledFontSize(16, theme),
                  },
                ]}
              >
                {nextAppointment.location}
              </Text>
              <Text
                style={[
                  styles.viewDetails,
                  {
                    color: theme.colors.primary,
                    fontSize: scaledFontSize(16, theme),
                  },
                ]}
              >
                View details →
              </Text>
            </AppCard>
          </Pressable>

          <Text
            accessibilityRole="header"
            style={[
              styles.sectionTitle,
              {
                color: theme.colors.ink,
                fontSize: scaledFontSize(21, theme),
              },
            ]}
          >
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
                      item.id === 'messages'
                        ? onNavigate.messages
                        : item.id === 'medical-notes'
                          ? onNavigate.records
                          : quickAccessFeedback[item.id]
                            ? () =>
                                showPrototypeFeedback(
                                  quickAccessFeedback[item.id],
                                )
                            : undefined
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
                  <Text
                    style={[
                      styles.preferencesTitle,
                      {
                        color: theme.colors.ink,
                        fontSize: scaledFontSize(16, theme),
                      },
                    ]}
                  >
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

                <Text
                  accessibilityElementsHidden
                  style={[
                    styles.chevron,
                    {
                      color: theme.colors.primary,
                      fontSize: scaledFontSize(32, theme),
                    },
                  ]}
                >
                  ›
                </Text>
              </View>
            </AppCard>
          </Pressable>
        </View>
      </ScreenContainer>
    </RootScreenLayout>
  );
}

const styles = StyleSheet.create({
  accessibilityLabel: {
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
    marginTop: spacing.sm,
  },
  appointmentTime: {
    fontWeight: '700',
    marginTop: spacing.sm,
  },
  chevron: {
    fontWeight: '700',
  },
  clinician: {
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
    marginBottom: spacing.sm,
    marginTop: 28,
  },
  greeting: {
    flex: 1,
    fontWeight: '700',
  },
  header: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  nextAppointment: {
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
    fontWeight: '700',
  },
  screen: {
    backgroundColor: colors.background,
    flex: 1,
  },
  sectionTitle: {
    fontWeight: '700',
    marginTop: 26,
    marginBottom: spacing.lg,
  },
  statusLabel: {
    fontWeight: '700',
  },
  statusPill: {
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
    fontWeight: '700',
    marginTop: spacing.sm,
  },
});
