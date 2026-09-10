import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { usePrototypeFeedback } from '../components/PrototypeFeedback';

import { AppCard } from '../components/AppCard';
import { PrimaryButton } from '../components/PrimaryButton';
import { ScreenContainer } from '../components/ScreenContainer';
import { colors, layout, spacing, typography } from '../theme/tokens';

export function MessageDetailScreen({ message, onBack }) {
  const { showPrototypeFeedback } = usePrototypeFeedback(); 
  const showLabResultsAction = message.type === 'lab-results';

  return (
    <View style={styles.screen}>
      <ScreenContainer>
        <View style={styles.content}>
          <Pressable
            accessibilityLabel="Back to messages"
            accessibilityRole="button"
            onPress={onBack}
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
              Messages
            </Text>
          </Pressable>

          <Text accessibilityRole="header" style={styles.subject}>
            {message.subject}
          </Text>

          <View style={styles.messageInfo}>
            <Text style={styles.sender}>{message.sender}</Text>
            <Text style={styles.date}>{message.date}</Text>
            <Text style={styles.status}>
              Status: {message.status}
            </Text>
          </View>

          <AppCard style={styles.messageCard}>
            <Text style={styles.body}>
              {message.body}
            </Text>
          </AppCard>

          {showLabResultsAction && (
  <View style={styles.primaryAction}>
    <PrimaryButton
  label="View lab results"
  onPress={() =>
    showPrototypeFeedback(
      'Viewing lab results is not available in this prototype.',
    )
  }
/>
  </View>
)}

<Pressable
  accessibilityLabel="Reply to message"
  accessibilityRole="button"
  onPress={() =>
    showPrototypeFeedback(
      'Replying to messages is not available in this prototype.',
    )
  }
  style={({ pressed }) => [
    styles.replyButton,
    pressed && styles.pressed,
  ]}
>
  <Text style={styles.replyText}>Reply</Text>
</Pressable>
        </View>
      </ScreenContainer>
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
  body: {
    color: colors.ink,
    fontSize: typography.body,
    lineHeight: 27,
  },
  content: {
    paddingBottom: spacing.xxl,
    paddingHorizontal: 18,
    paddingTop: 28,
  },
  date: {
    color: colors.mutedInk,
    fontSize: typography.label,
    marginTop: spacing.sm,
  },
  messageCard: {
    marginTop: spacing.lg,
  },
  messageInfo: {
    marginTop: spacing.md,
  },
  pressed: {
    opacity: 0.7,
  },
  primaryAction: {
    marginTop: spacing.lg,
  },
  replyButton: {
    alignItems: 'center',
    borderColor: colors.primary,
    borderRadius: 12,
    borderWidth: 2,
    justifyContent: 'center',
    marginTop: spacing.lg,
    minHeight: layout.minimumTouchTarget,
    paddingHorizontal: spacing.lg,
  },
  replyText: {
    color: colors.primary,
    fontSize: typography.body,
    fontWeight: '700',
  },
  screen: {
    backgroundColor: colors.background,
    flex: 1,
  },
  sender: {
    color: colors.ink,
    fontSize: typography.body,
    fontWeight: '700',
  },
  status: {
    color: colors.mutedInk,
    fontSize: typography.label,
    marginTop: spacing.sm,
  },
  subject: {
    color: colors.ink,
    fontSize: 23,
    fontWeight: '700',
  },
});