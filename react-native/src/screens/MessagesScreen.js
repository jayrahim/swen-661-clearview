import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { RootScreenLayout } from '../components/RootScreenLayout';
import { ResponsiveContent } from '../components/ResponsiveContent';
import {
  getMessages,
  getUnreadMessageCount,
} from '../repositories/messagesRepository';
import { layout, scaledFontSize, spacing } from '../theme/tokens';
import { useClearViewTheme } from '../theme/useClearViewTheme';

function formatMessageDate(sentAt, now = new Date()) {
  const sentDate = new Date(
    sentAt.getFullYear(),
    sentAt.getMonth(),
    sentAt.getDate(),
  );

  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  if (sentDate.getTime() === today.getTime()) {
    return `Today • ${formatTime(sentAt)}`;
  }

  if (sentDate.getTime() === yesterday.getTime()) {
    return `Yesterday • ${formatTime(sentAt)}`;
  }

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

  return `${months[sentAt.getMonth()]} ${sentAt.getDate()} • ${formatTime(
    sentAt,
  )}`;
}

function formatTime(dateTime) {
  const hours = dateTime.getHours();

  const hour = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
  const minute = dateTime.getMinutes().toString().padStart(2, '0');
  const period = hours >= 12 ? 'PM' : 'AM';

  return `${hour}:${minute} ${period}`;
}

export function MessagesScreen({ onNavigate = {}, onSelectMessage }) {
  const { theme } = useClearViewTheme();

  const messages = getMessages();
  const unreadCount = getUnreadMessageCount();

  return (
    <RootScreenLayout
      activeItem="messages"
      onNavigate={onNavigate}
      style={{ backgroundColor: theme.colors.background }}
    >
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.content}>
          <ResponsiveContent>
            <View style={styles.header}>
              <Text
                accessibilityRole="header"
                style={[
                  styles.title,
                  {
                    color: theme.colors.ink,
                    fontSize: scaledFontSize(24, theme),
                  },
                ]}
              >
                Messages
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

            <View
              accessible
              accessibilityLabel={`${unreadCount} unread messages`}
              style={[
                styles.unreadBadge,
                {
                  borderColor: theme.colors.primary,
                  borderWidth: theme.borderWidth,
                },
              ]}
            >
              <Text
                style={[
                  styles.unreadText,
                  {
                    color: theme.colors.primary,
                    fontSize: scaledFontSize(16, theme),
                  },
                ]}
              >
                {unreadCount} unread
              </Text>
            </View>

            <View style={styles.messageList}>
              {messages.map((message) => {
                const formattedDate = formatMessageDate(message.sentAt);

                const accessibilityLabel = `${
                  message.isRead ? 'Read' : 'Unread'
                } message from ${message.sender}. ${
                  message.subject
                }. ${formattedDate}`;

                return (
                  <Pressable
                    key={message.id}
                    accessibilityLabel={accessibilityLabel}
                    accessibilityRole="button"
                    onPress={() => onSelectMessage?.(message)}
                    style={[
                      styles.messageCard,
                      {
                        backgroundColor: theme.colors.surface,
                        borderColor: theme.colors.border,
                        borderWidth: theme.borderWidth,
                      },
                    ]}
                  >
                    <View style={styles.messageHeader}>
                      <View style={styles.senderRow}>
                        {!message.isRead && (
                          <View
                            accessible
                            accessibilityLabel="Unread"
                            style={[
                              styles.unreadDot,
                              {
                                backgroundColor: theme.colors.primary,
                              },
                            ]}
                          />
                        )}

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
                      </View>

                      <Text
                        style={[
                          styles.date,
                          {
                            color: theme.colors.mutedInk,
                            fontSize: scaledFontSize(14, theme),
                          },
                        ]}
                      >
                        {formattedDate}
                      </Text>
                    </View>

                    <Text
                      style={[
                        styles.subject,
                        {
                          color: theme.colors.ink,
                          fontSize: scaledFontSize(16, theme),
                          fontWeight: message.isRead ? '400' : '600',
                        },
                      ]}
                    >
                      {message.subject}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </ResponsiveContent>
        </ScrollView>
      </View>
    </RootScreenLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 18,
    paddingBottom: spacing.xl,
  },
  date: {
    marginLeft: spacing.md,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  messageCard: {
    borderRadius: 12,
    marginBottom: spacing.md,
    minHeight: layout.minimumTouchTarget,
    padding: spacing.lg,
  },
  messageHeader: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  messageList: {
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
  sender: {
    flexShrink: 1,
    fontWeight: '700',
  },
  senderRow: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
  },
  subject: {
    marginTop: spacing.sm,
  },
  title: {
    flex: 1,
    fontWeight: '700',
  },
  unreadBadge: {
    alignSelf: 'flex-start',
    borderRadius: 999,
    marginTop: spacing.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  unreadDot: {
    borderRadius: 5,
    height: 10,
    marginRight: spacing.sm,
    width: 10,
  },
  unreadText: {
    fontWeight: '600',
  },
});
