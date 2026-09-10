import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { usePrototypeFeedback } from '../components/PrototypeFeedback';

import { AppCard } from '../components/AppCard';
import { BottomNavigation } from '../components/BottomNavigation';
import { ScreenContainer } from '../components/ScreenContainer';
import { getMessages } from '../repositories/messagesRepository';
import { colors, layout, spacing, typography } from '../theme/tokens';

export function MessagesScreen({ onHome, onSelectMessage }) {
  const { showPrototypeFeedback } = usePrototypeFeedback();
  const messages = getMessages();

  return (
    <View style={styles.screen}>
      <ScreenContainer>
        <View style={styles.content}>
          <Pressable
            accessibilityLabel="Back to dashboard"
            accessibilityRole="button"
            onPress={onHome}
            style={({ pressed }) => [
              styles.backButton,
              pressed && styles.pressed,
            ]}
          >
            <Ionicons
              color={colors.primary}
              name="arrow-back"
              size={24}
            />

            <Text style={styles.backText}>
              Dashboard
            </Text>
          </Pressable>

          <View style={styles.headerRow}>
            <Text accessibilityRole="header" style={styles.title}>
              Messages
            </Text>

           <Pressable
  accessibilityLabel="Compose message"
  accessibilityRole="button"
  onPress={() =>
    showPrototypeFeedback(
      'Composing a new message is not available in this prototype.',
    )
  }
>
  <Text>Compose</Text>
</Pressable>
          </View>

          {messages.map((message) => (
            <Pressable
              accessibilityLabel={`${message.sender}, ${message.subject}`}
              accessibilityRole="button"
              key={message.id}
              onPress={() => onSelectMessage(message)}
              style={({ pressed }) => pressed && styles.pressed}
            >
              <AppCard style={styles.messageCard}>
                <View style={styles.messageHeader}>
                  <Text style={styles.sender}>
                    {message.sender}
                  </Text>

                  <Text style={styles.date}>
                    {message.date}
                  </Text>
                </View>

                <Text style={styles.subject}>
                  {message.subject}
                </Text>

                <Text numberOfLines={2} style={styles.preview}>
                  {message.preview}
                </Text>

                {message.status === 'Unread' && (
                  <Text style={styles.unread}>
                    Unread
                  </Text>
                )}
              </AppCard>
            </Pressable>
          ))}
        </View>
      </ScreenContainer>

      <BottomNavigation
        activeItem="messages"
        onNavigate={{
          home: onHome,
        }}
      />
          </View>
  );
}

const styles = StyleSheet.create({
  backButton: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: spacing.lg,
    minHeight: layout.minimumTouchTarget,
  },
  backText: {
    color: colors.primary,
    fontSize: typography.body,
    fontWeight: '700',
    marginLeft: spacing.sm,
  },
  composeButton: {
    justifyContent: 'center',
    minHeight: layout.minimumTouchTarget,
    paddingHorizontal: spacing.lg,
  },
  composeText: {
    color: colors.primary,
    fontSize: typography.body,
    fontWeight: '700',
  },
  content: {
    paddingBottom: spacing.xxl,
    paddingHorizontal: 18,
    paddingTop: 28,
  },
  date: {
    color: colors.mutedInk,
    fontSize: typography.label,
    marginLeft: spacing.md,
  },
  headerRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  messageCard: {
    marginBottom: spacing.lg,
  },
  messageHeader: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  pressed: {
    opacity: 0.7,
  },
  preview: {
    color: colors.mutedInk,
    fontSize: typography.body,
    marginTop: spacing.sm,
  },
  screen: {
    backgroundColor: colors.background,
    flex: 1,
  },
  sender: {
    color: colors.ink,
    flex: 1,
    fontSize: typography.body,
    fontWeight: '700',
  },
  subject: {
    color: colors.ink,
    fontSize: typography.body,
    fontWeight: '700',
    marginTop: spacing.sm,
  },
  title: {
    color: colors.ink,
    fontSize: 23,
    fontWeight: '700',
  },
  unread: {
    color: colors.primary,
    fontSize: typography.label,
    fontWeight: '700',
    marginTop: spacing.sm,
  },
});