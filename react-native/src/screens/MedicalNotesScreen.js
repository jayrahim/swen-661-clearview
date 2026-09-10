import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { AppCard } from '../components/AppCard';
import { BottomNavigation } from '../components/BottomNavigation';
import {
  PrototypeFeedbackAnchor,
  usePrototypeFeedback,
} from '../components/PrototypeFeedback';
import { SafeAreaScreen } from '../components/SafeAreaScreen';
import { medicalNotesRepository } from '../data/medicalNotes';
import { colors, layout, scaledFontSize, spacing } from '../theme/tokens';
import { useClearViewTheme } from '../theme/useClearViewTheme';
import { medicalNoteShortDate } from '../utils/medicalNoteFormat';

const guidance =
  'Notes use plain-language headings and flexible text blocks that expand when text size increases.';

export function MedicalNotesScreen({ onNavigate = {}, onSelect }) {
  const { theme } = useClearViewTheme();
  const { showPrototypeFeedback } = usePrototypeFeedback();
  const notes = medicalNotesRepository.getAll();

  return (
    <SafeAreaScreen style={{ backgroundColor: theme.colors.background }}>
      <PrototypeFeedbackAnchor
        bottomOffset={layout.bottomNavigationHeight + spacing.md}
      />
      <ScrollView contentContainerStyle={styles.content}>
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
            Medical Notes
          </Text>
          <Pressable
            accessibilityLabel="Filter medical notes"
            accessibilityRole="button"
            onPress={() =>
              showPrototypeFeedback(
                'Filtering is not available in this prototype.',
              )
            }
            style={({ pressed }) => [styles.filter, pressed && styles.pressed]}
          >
            <Text
              style={{
                color: theme.colors.primary,
                fontSize: scaledFontSize(16, theme),
                fontWeight: '700',
              }}
            >
              Filter
            </Text>
          </Pressable>
        </View>
        <Text
          accessibilityRole="header"
          style={[
            styles.heading,
            {
              color: theme.colors.ink,
              fontSize: scaledFontSize(20, theme),
            },
          ]}
        >
          Recent notes
        </Text>
        {notes.map((note) => (
          <Pressable
            accessibilityLabel={`${note.status} note: ${note.title}, ${note.author}, ${medicalNoteShortDate(note.createdAt)}`}
            accessibilityRole="button"
            key={note.id}
            onPress={() => onSelect(note)}
            style={({ pressed }) => pressed && styles.pressed}
          >
            <AppCard style={styles.card}>
              <Text
                style={{
                  color: theme.colors.mutedInk,
                  fontSize: scaledFontSize(14, theme),
                  fontWeight: '700',
                }}
              >
                {medicalNoteShortDate(note.createdAt)}
              </Text>
              <Text
                style={[
                  styles.noteTitle,
                  {
                    color: theme.colors.ink,
                    fontSize: scaledFontSize(18, theme),
                  },
                ]}
              >
                {note.title}
              </Text>
              <Text
                style={{
                  color: theme.colors.mutedInk,
                  fontSize: scaledFontSize(16, theme),
                }}
              >
                {note.author}
              </Text>
              <View style={styles.cardFooter}>
                <StatusPill note={note} theme={theme} />
                <Text
                  style={{
                    color: theme.colors.primary,
                    fontSize: scaledFontSize(16, theme),
                    fontWeight: '700',
                  }}
                >
                  Open ›
                </Text>
              </View>
            </AppCard>
          </Pressable>
        ))}
        <View
          accessibilityLabel={guidance}
          accessible
          style={[
            styles.guidance,
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
              fontSize: scaledFontSize(16, theme),
            }}
          >
            {guidance}
          </Text>
        </View>
      </ScrollView>
      <BottomNavigation activeItem="records" onNavigate={onNavigate} />
    </SafeAreaScreen>
  );
}

function StatusPill({ note, theme }) {
  const reviewed = note.status === 'Reviewed';
  const color = reviewed ? theme.colors.mintInk : theme.colors.primary;

  return (
    <View
      style={[
        styles.status,
        {
          backgroundColor: theme.isHighContrast
            ? theme.colors.surface
            : reviewed
              ? colors.mint
              : colors.blueTile,
          borderColor: color,
          borderWidth: theme.isHighContrast ? theme.borderWidth : 0,
        },
      ]}
    >
      <Text
        style={{
          color,
          fontSize: scaledFontSize(14, theme),
          fontWeight: '700',
        }}
      >
        {note.status}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { marginBottom: spacing.lg },
  cardFooter: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.lg,
  },
  content: { padding: 18 },
  filter: {
    justifyContent: 'center',
    minHeight: layout.minimumTouchTarget,
    paddingHorizontal: spacing.md,
  },
  guidance: { borderRadius: 12, marginTop: spacing.sm, padding: spacing.lg },
  heading: {
    fontWeight: '700',
    marginBottom: spacing.lg,
    marginTop: spacing.lg,
  },
  header: { alignItems: 'center', flexDirection: 'row' },
  noteTitle: {
    fontWeight: '700',
    marginBottom: spacing.sm,
    marginTop: spacing.md,
  },
  pressed: { opacity: 0.7 },
  status: { borderRadius: 18, paddingHorizontal: 10, paddingVertical: 7 },
  title: { flex: 1, fontWeight: '700' },
});
