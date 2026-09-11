import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { AppCard } from '../components/AppCard';
import { PrimaryButton } from '../components/PrimaryButton';
import { usePrototypeFeedback } from '../components/PrototypeFeedback';
import { ResponsiveContent } from '../components/ResponsiveContent';
import { RootScreenLayout } from '../components/RootScreenLayout';
import { layout, scaledFontSize, spacing } from '../theme/tokens';
import { useClearViewTheme } from '../theme/useClearViewTheme';

function formatMessageDate(sentAt) {
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];

  const hour =
    sentAt.getHours() === 0
      ? 12
      : sentAt.getHours() > 12
        ? sentAt.getHours() - 12
        : sentAt.getHours();

  const minute = sentAt.getMinutes().toString().padStart(2, '0');
  const period = sentAt.getHours() >= 12 ? 'PM' : 'AM';

  return `${months[sentAt.getMonth()]} ${sentAt.getDate()} • ${hour}:${minute} ${period}`;
}

export function MessageDetailScreen({ message, onBack, onNavigate = {} }) {
  const { theme } = useClearViewTheme();
  const { showPrototypeFeedback } = usePrototypeFeedback();

  return (
    <RootScreenLayout
      activeItem="messages"
      onNavigate={onNavigate}
      showPhoneNavigation={false}
      style={{ backgroundColor: theme.colors.background }}
    >
      <ScrollView contentContainerStyle={styles.content}>
        <ResponsiveContent>
          <View style={styles.header}>
            <Pressable
              accessibilityLabel="Back to messages"
              accessibilityRole="button"
              onPress={onBack}
              style={styles.back}
            >
              <Text
                style={[
                  styles.backText,
                  {
                    color: theme.colors.primary,
                    fontSize: scaledFontSize(34, theme),
                  },
                ]}
              >
                ‹
              </Text>
            </Pressable>

            <Text
              accessibilityRole="header"
              style={[
                styles.headerTitle,
                {
                  color: theme.colors.ink,
                  fontSize: scaledFontSize(24, theme),
                },
              ]}
            >
              Message
            </Text>

            <View
              accessible
              accessibilityLabel="User profile"
              style={[
                styles.profileAvatar,
                {
                  backgroundColor: theme.colors.primary,
                },
              ]}
            >
              <Text
                style={[
                  styles.profileInitial,
                  {
                    color: theme.colors.background,
                    fontSize: scaledFontSize(16, theme),
                  },
                ]}
              >
                A
              </Text>
            </View>
          </View>

          <View style={styles.messageInfo}>
            <Text
              style={[
                styles.sender,
                {
                  color: theme.colors.ink,
                  fontSize: scaledFontSize(16, theme),
                },
              ]}
            >
              {message.sender}
            </Text>

            <Text
              style={[
                styles.date,
                {
                  color: theme.colors.mutedInk,
                  fontSize: scaledFontSize(14, theme),
                },
              ]}
            >
              {formatMessageDate(message.sentAt)}
            </Text>
          </View>

          <View
            style={[
              styles.divider,
              {
                backgroundColor: theme.colors.mutedInk,
              },
            ]}
          />

          <Text
            style={[
              styles.subject,
              {
                color: theme.colors.ink,
                fontSize: scaledFontSize(24, theme),
              },
            ]}
          >
            {message.subject}
          </Text>

          <AppCard style={styles.messageCard}>
            <Text
              accessibilityLabel={`Message from ${message.sender}`}
              style={[
                styles.body,
                {
                  color: theme.colors.ink,
                  fontSize: scaledFontSize(16, theme),
                  lineHeight: scaledFontSize(24, theme),
                },
              ]}
            >
              {message.body ?? message.preview}
            </Text>
          </AppCard>

          {message.statusMessage && (
            <View
              accessible
              accessibilityLabel={`${message.statusMessage}${
                message.statusDetail ? `. ${message.statusDetail}` : ''
              }`}
              style={[
                styles.statusCard,
                {
                  borderColor: theme.colors.primary,
                  borderWidth: theme.borderWidth,
                },
              ]}
            >
              <Text
                style={[
                  styles.statusTitle,
                  {
                    color: theme.colors.ink,
                    fontSize: scaledFontSize(16, theme),
                  },
                ]}
              >
                {message.statusMessage}
              </Text>

              {message.statusDetail && (
                <Text
                  style={[
                    styles.statusDetail,
                    {
                      color: theme.colors.mutedInk,
                      fontSize: scaledFontSize(14, theme),
                    },
                  ]}
                >
                  {message.statusDetail}
                </Text>
              )}
            </View>
          )}

          {message.showLabResultsAction && (
            <View style={styles.primaryAction}>
              <PrimaryButton
                label="View lab results"
                onPress={() =>
                  showPrototypeFeedback(
                    'Lab results are not available in this prototype.',
                  )
                }
              />
            </View>
          )}

          <Pressable
            accessibilityLabel="Reply to message"
            accessibilityRole="button"
            onPress={() =>
              showPrototypeFeedback('Reply is not available in this prototype.')
            }
            style={[
              styles.replyButton,
              {
                borderColor: theme.colors.primary,
                borderWidth: theme.borderWidth,
              },
            ]}
          >
            <Text
              style={[
                styles.replyText,
                {
                  color: theme.colors.primary,
                  fontSize: scaledFontSize(16, theme),
                },
              ]}
            >
              Reply
            </Text>
          </Pressable>
        </ResponsiveContent>
      </ScrollView>
    </RootScreenLayout>
  );
}

const styles = StyleSheet.create({
  back: {
    justifyContent: 'center',
    minHeight: 48,
    minWidth: 48,
  },
  backText: {
    fontWeight: '700',
  },
  body: {},
  content: {
    padding: 18,
  },
  date: {
    marginTop: spacing.sm,
  },
  divider: {
    height: 1,
    marginTop: 14,
    opacity: 0.3,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  headerTitle: {
    flex: 1,
    fontWeight: '700',
    marginLeft: spacing.sm,
  },
  messageCard: {
    marginTop: spacing.lg,
  },
  messageInfo: {
    marginTop: spacing.lg,
  },
  primaryAction: {
    marginTop: spacing.lg,
  },
  profileAvatar: {
    alignItems: 'center',
    borderRadius: 22,
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
  profileInitial: {
    fontWeight: '700',
  },
  replyButton: {
    alignItems: 'center',
    borderRadius: 12,
    justifyContent: 'center',
    marginTop: spacing.sm,
    minHeight: layout.minimumTouchTarget,
    paddingHorizontal: spacing.lg,
  },
  replyText: {
    fontWeight: '700',
  },
  sender: {
    fontWeight: '700',
  },
  statusCard: {
    borderRadius: 12,
    marginTop: 36,
    padding: 16,
  },
  statusDetail: {
    marginTop: spacing.sm,
  },
  statusTitle: {
    fontWeight: '600',
  },
  subject: {
    fontWeight: '700',
    marginTop: 14,
  },
});
