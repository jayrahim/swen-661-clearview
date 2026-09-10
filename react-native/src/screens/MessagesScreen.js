import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { AppCard } from '../components/AppCard';
import { BottomNavigation } from '../components/BottomNavigation';
import {
  PrototypeFeedbackAnchor,
  usePrototypeFeedback,
} from '../components/PrototypeFeedback';
import { SafeAreaScreen } from '../components/SafeAreaScreen';
import { getMessages } from '../repositories/messagesRepository';
import { layout, scaledFontSize, spacing } from '../theme/tokens';
import { useClearViewTheme } from '../theme/useClearViewTheme';

export function MessagesScreen({ onNavigate = {}, onSelectMessage }) {
  const { theme } = useClearViewTheme();
  const { showPrototypeFeedback } = usePrototypeFeedback();
  const messages = getMessages();

  return (
    <SafeAreaScreen style={{ backgroundColor: theme.colors.background }}>
      <PrototypeFeedbackAnchor
        bottomOffset={layout.bottomNavigationHeight + spacing.md}
      />

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.headerRow}>
          <Text
            accessibilityRole="header"
            style={[styles.title, { color: theme.colors.ink }]}
          >
            Messages
          </Text>

          <Pressable
            accessibilityLabel="Compose message"
            accessibilityRole="button"
            onPress={() =>
              showPrototypeFeedback(
                'Composing a new message is not part of the scope of this prototype.',
              )
            }
            style={({ pressed }) => [
              styles.composeButton,
              pressed && styles.pressed,
            ]}
          >
            <Text
              style={[
                styles.composeText,
                {
                  color: theme.colors.primary,
                  fontSize: scaledFontSize(16, theme),
                },
              ]}
            >
              Compose
            </Text>
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
                <Text style={[styles.sender, { color: theme.colors.ink }]}>
                  {message.sender}
                </Text>

                <Text style={[styles.date, { color: theme.colors.mutedInk }]}>
                  {message.date}
                </Text>
              </View>

              <Text style={[styles.subject, { color: theme.colors.ink }]}>
                {message.subject}
              </Text>

              <Text style={[styles.preview, { color: theme.colors.mutedInk }]}>
                {message.preview}
              </Text>

              {message.status === 'Unread' && (
                <Text style={[styles.unread, { color: theme.colors.primary }]}>
                  Unread
                </Text>
              )}
            </AppCard>
          </Pressable>
        ))}
      </ScrollView>

      <BottomNavigation activeItem="messages" onNavigate={onNavigate} />
    </SafeAreaScreen>
  );
}

const styles = StyleSheet.create({
  composeButton: {
    justifyContent: 'center',
    minHeight: layout.minimumTouchTarget,
    paddingHorizontal: spacing.lg,
  },
  composeText: {
    fontWeight: '700',
  },
  content: {
    padding: 18,
  },
  date: {
    fontSize: 14,
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
  preview: {
    fontSize: 16,
    marginTop: spacing.sm,
  },
  pressed: {
    opacity: 0.7,
  },
  sender: {
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
  },
  subject: {
    fontSize: 16,
    fontWeight: '700',
    marginTop: spacing.sm,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
  },
  unread: {
    fontSize: 14,
    fontWeight: '700',
    marginTop: spacing.sm,
  },
});