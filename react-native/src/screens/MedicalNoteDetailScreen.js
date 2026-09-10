import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { usePrototypeFeedback } from '../components/PrototypeFeedback';
import { SafeAreaScreen } from '../components/SafeAreaScreen';
import { scaledFontSize, spacing } from '../theme/tokens';
import { useClearViewTheme } from '../theme/useClearViewTheme';
import { medicalNoteDate } from '../utils/medicalNoteFormat';

export function MedicalNoteDetailScreen({ note, onBack }) {
  const { theme } = useClearViewTheme();
  const { showPrototypeFeedback } = usePrototypeFeedback();

  return (
    <SafeAreaScreen style={{ backgroundColor: theme.colors.background }}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Pressable
            accessibilityLabel="Back to medical notes"
            accessibilityRole="button"
            onPress={onBack}
            style={styles.back}
          >
            <Text
              style={{
                color: theme.colors.primary,
                fontSize: scaledFontSize(34, theme),
                fontWeight: '700',
              }}
            >
              ‹
            </Text>
          </Pressable>
          <Text
            accessibilityRole="header"
            style={{
              color: theme.colors.ink,
              fontSize: scaledFontSize(24, theme),
              fontWeight: '700',
            }}
          >
            Visit Note
          </Text>
        </View>
        <Text
          style={{
            color: theme.colors.ink,
            fontSize: scaledFontSize(24, theme),
            fontWeight: '700',
          }}
        >
          {note.title}
        </Text>
        <Text
          style={[
            styles.author,
            {
              color: theme.colors.mutedInk,
              fontSize: scaledFontSize(16, theme),
            },
          ]}
        >
          {note.author} • {medicalNoteDate(note.createdAt)}
        </Text>
        <NoteSection label="Summary" theme={theme} values={[note.summary]} />
        <NoteSection
          label="Assessment"
          theme={theme}
          values={note.assessment}
        />
        <NoteSection label="Plan" theme={theme} values={[note.plan]} />
        <Pressable
          accessibilityLabel="Need help understanding this note? Message your care team with a question."
          accessibilityRole="button"
          onPress={() =>
            showPrototypeFeedback(
              'Messaging the care team is not available in this prototype.',
            )
          }
          style={[
            styles.prompt,
            {
              backgroundColor: theme.colors.infoBackground,
              borderColor: theme.colors.infoBorder,
              borderWidth: theme.borderWidth,
            },
          ]}
        >
          <Text
            style={{
              color: theme.colors.primary,
              fontSize: scaledFontSize(18, theme),
              fontWeight: '700',
            }}
          >
            Need help understanding this note?
          </Text>
          <Text
            style={[
              styles.promptDetail,
              { color: theme.colors.ink, fontSize: scaledFontSize(16, theme) },
            ]}
          >
            Message your care team with a question.
          </Text>
        </Pressable>
      </ScrollView>
    </SafeAreaScreen>
  );
}

function NoteSection({ label, theme, values }) {
  return (
    <View
      style={[
        styles.section,
        {
          borderBottomColor: theme.colors.border,
          borderBottomWidth: theme.borderWidth,
        },
      ]}
    >
      <Text
        style={{
          color: theme.colors.ink,
          fontSize: scaledFontSize(18, theme),
          fontWeight: '700',
        }}
      >
        {label}
      </Text>
      {values.map((value) => (
        <Text
          key={value}
          style={[
            styles.sectionValue,
            { color: theme.colors.ink, fontSize: scaledFontSize(16, theme) },
          ]}
        >
          {value}
        </Text>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  author: { marginTop: spacing.sm },
  back: { justifyContent: 'center', minHeight: 48, minWidth: 48 },
  content: { padding: 18 },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: spacing.lg,
  },
  prompt: { borderRadius: 12, marginTop: spacing.xl, padding: spacing.lg },
  promptDetail: { marginTop: spacing.sm },
  section: { marginTop: spacing.xl, paddingBottom: spacing.xl },
  sectionValue: { marginTop: spacing.sm },
});
