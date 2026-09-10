import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { AppCard } from '../components/AppCard';
import { PrimaryButton } from '../components/PrimaryButton';
import { usePrototypeFeedback } from '../components/PrototypeFeedback';
import { SafeAreaScreen } from '../components/SafeAreaScreen';
import { layout, scaledFontSize, spacing } from '../theme/tokens';
import { useClearViewTheme } from '../theme/useClearViewTheme';

export function MessageDetailScreen({ message, onBack }) {
  const { theme } = useClearViewTheme();
  const { showPrototypeFeedback } = usePrototypeFeedback();
  const showLabResultsAction = message.type === 'lab-results';

  return (
    <SafeAreaScreen style={{ backgroundColor: theme.colors.background }}>
      <ScrollView contentContainerStyle={styles.content}>
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
            style={[styles.subject, { color: theme.colors.ink }]}
          >
            {message.subject}
          </Text>
        </View>
        <View style={styles.messageInfo}>
          <Text style={[styles.sender, { color: theme.colors.ink }]}>
            {message.sender}
          </Text>
          <Text style={[styles.date, { color: theme.colors.mutedInk }]}>
            {message.date}
          </Text>
          <Text style={[styles.status, { color: theme.colors.mutedInk }]}>
            Status: {message.status}
          </Text>
        </View>
        <AppCard style={styles.messageCard}>
          <Text style={[styles.body, { color: theme.colors.ink }]}>
            {message.body}
          </Text>
        </AppCard>
        {showLabResultsAction && (
          <View style={styles.primaryAction}>
            <PrimaryButton
              label="View lab results"
              onPress={() =>
                showPrototypeFeedback(
                  'Viewing lab results is not part of the scope of this prototype.',
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
              'Replying to messages is not part of the scope of this prototype.',
            )
          }
          style={[
            styles.replyButton,
            {
              borderColor: theme.colors.primary,
              borderWidth: theme.borderWidth,
            },
          ]}
        >
          <Text style={[styles.replyText, { color: theme.colors.primary }]}>
            Reply
          </Text>
        </Pressable>
      </ScrollView>
    </SafeAreaScreen>
  );
}

const styles = StyleSheet.create({
  back: { justifyContent: 'center', minHeight: 48, minWidth: 48 },
  backText: { fontWeight: '700' },
  body: { fontSize: 16, lineHeight: 27 },
  content: { padding: 18 },
  date: { fontSize: 14, marginTop: spacing.sm },
  header: { alignItems: 'center', flexDirection: 'row' },
  messageCard: { marginTop: spacing.lg },
  messageInfo: { marginTop: spacing.md },
  primaryAction: { marginTop: spacing.lg },
  replyButton: {
    alignItems: 'center',
    borderRadius: 12,
    justifyContent: 'center',
    marginTop: spacing.lg,
    minHeight: layout.minimumTouchTarget,
    paddingHorizontal: spacing.lg,
  },
  replyText: { fontSize: 16, fontWeight: '700' },
  sender: { fontSize: 16, fontWeight: '700' },
  status: { fontSize: 14, marginTop: spacing.sm },
  subject: { flex: 1, fontSize: 24, fontWeight: '700' },
});
