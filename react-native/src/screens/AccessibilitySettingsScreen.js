import { Pressable, StyleSheet, Text, View } from 'react-native';

import { usePrototypeFeedback } from '../components/PrototypeFeedback';
import { ScreenContainer } from '../components/ScreenContainer';
import { useAccessibilityPreferences } from '../state/accessibilityPreferences';
import { scaledFontSize } from '../theme/tokens';
import { useClearViewTheme } from '../theme/useClearViewTheme';

const options = [
  ['Text size', 'Adjust text across the app', 'cycle-text-size'],
  [
    'High contrast',
    'Increase contrast for text and controls',
    'toggle-high-contrast',
  ],
  ['Reduced clutter', 'Show fewer secondary items', 'toggle-reduced-clutter'],
];

function cardSurface(theme) {
  return {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderWidth: theme.borderWidth,
  };
}

/**
 * Settings is modeled as a root route but retains Flutter's explicit
 * return-to-dashboard affordance rather than persistent phone tab navigation.
 */
export function AccessibilitySettingsScreen({ onNavigate = {} }) {
  const { preferences, dispatch } = useAccessibilityPreferences();
  const { theme } = useClearViewTheme();
  const { showPrototypeFeedback } = usePrototypeFeedback();
  const valueFor = (action) => {
    if (action === 'cycle-text-size') return preferences.textSize.label;
    if (action === 'toggle-high-contrast') {
      return preferences.highContrast ? 'On' : 'Off';
    }
    return preferences.reducedClutter ? 'On' : 'Off';
  };

  return (
    <ScreenContainer>
      <View
        style={[styles.content, { backgroundColor: theme.colors.background }]}
      >
        <View
          style={[
            styles.header,
            {
              borderColor: theme.colors.border,
              borderWidth: theme.borderWidth,
            },
          ]}
        >
          <Pressable
            accessibilityLabel="Back to dashboard"
            accessibilityRole="button"
            onPress={onNavigate.home}
            style={styles.back}
          >
            <Text style={[styles.backLabel, { color: theme.colors.primary }]}>
              ‹
            </Text>
          </Pressable>
          <Text
            accessibilityRole="header"
            style={[styles.title, { color: theme.colors.ink }]}
          >
            Accessibility
          </Text>
        </View>
        <View style={styles.body}>
          <Text
            style={[
              styles.description,
              {
                color: theme.colors.mutedInk,
                fontSize: scaledFontSize(16, theme),
              },
            ]}
          >
            Make CareConnect easier to see and use.
          </Text>
          {options.map(([title, description, action]) => (
            <Pressable
              accessibilityLabel={`${title}, ${valueFor(action)}. ${description}`}
              accessibilityRole="button"
              key={action}
              onPress={() => dispatch({ type: action })}
              style={[styles.card, cardSurface(theme)]}
            >
              <View style={styles.optionCopy}>
                <Text
                  style={[
                    styles.optionTitle,
                    {
                      color: theme.colors.ink,
                      fontSize: scaledFontSize(16, theme),
                    },
                  ]}
                >
                  {title}
                </Text>
                <Text
                  style={[
                    styles.optionDescription,
                    {
                      color: theme.colors.mutedInk,
                      fontSize: scaledFontSize(14, theme),
                    },
                  ]}
                >
                  {description}
                </Text>
              </View>
              <View
                style={[
                  styles.value,
                  {
                    borderColor: theme.colors.primary,
                    borderWidth: theme.borderWidth,
                  },
                ]}
              >
                <Text
                  style={[styles.valueText, { color: theme.colors.primary }]}
                >
                  {valueFor(action)}
                </Text>
              </View>
            </Pressable>
          ))}
          <Pressable
            accessibilityLabel="Color preference, Cool. Use a calmer accent palette"
            accessibilityRole="button"
            onPress={() =>
              showPrototypeFeedback(
                'Color preference is not available in this prototype.',
              )
            }
            style={[styles.card, cardSurface(theme)]}
          >
            <View style={styles.optionCopy}>
              <Text
                style={[
                  styles.optionTitle,
                  {
                    color: theme.colors.ink,
                    fontSize: scaledFontSize(16, theme),
                  },
                ]}
              >
                Color preference
              </Text>
              <Text
                style={[
                  styles.optionDescription,
                  {
                    color: theme.colors.mutedInk,
                    fontSize: scaledFontSize(14, theme),
                  },
                ]}
              >
                Use a calmer accent palette
              </Text>
            </View>
            <View
              style={[
                styles.value,
                {
                  borderColor: theme.colors.primary,
                  borderWidth: theme.borderWidth,
                },
              ]}
            >
              <Text style={[styles.valueText, { color: theme.colors.primary }]}>
                Cool
              </Text>
            </View>
          </Pressable>
          <View
            style={[
              styles.preview,
              {
                backgroundColor: theme.colors.infoBackground,
                borderColor: theme.colors.infoBorder,
                borderWidth: theme.borderWidth,
              },
            ]}
          >
            <Text
              style={[styles.previewTitle, { color: theme.colors.primary }]}
            >
              Live preview
            </Text>
            <Text
              style={[
                styles.previewText,
                {
                  color: theme.colors.ink,
                  fontSize: scaledFontSize(16, theme),
                },
              ]}
            >
              Appointments and messages remain readable at your selected size.
            </Text>
          </View>
          <Pressable
            accessibilityLabel="Reset preferences"
            accessibilityRole="button"
            onPress={() => dispatch({ type: 'reset' })}
            style={[
              styles.reset,
              {
                borderColor: theme.colors.primary,
                borderWidth: theme.borderWidth,
              },
            ]}
          >
            <Text style={[styles.resetText, { color: theme.colors.primary }]}>
              Reset preferences
            </Text>
          </Pressable>
        </View>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: { flex: 1 },
  header: {
    alignItems: 'center',
    borderBottomWidth: 1,
    flexDirection: 'row',
    paddingHorizontal: 18,
    paddingVertical: 13,
  },
  back: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
    minWidth: 48,
  },
  backLabel: { fontSize: 34, fontWeight: '700' },
  title: { fontSize: 24, fontWeight: '700', marginLeft: 14 },
  body: { padding: 18 },
  description: { marginBottom: 28 },
  card: {
    alignItems: 'center',
    borderRadius: 14,
    flexDirection: 'row',
    marginBottom: 18,
    minHeight: 94,
    padding: 14,
  },
  optionCopy: { flex: 1 },
  optionTitle: { fontWeight: '700' },
  optionDescription: { marginTop: 8 },
  value: { borderRadius: 22, paddingHorizontal: 16, paddingVertical: 8 },
  valueText: { fontWeight: '700' },
  preview: { borderRadius: 12, marginTop: 12, padding: 14 },
  previewTitle: { fontWeight: '700' },
  previewText: { marginTop: 6 },
  reset: {
    alignItems: 'center',
    borderRadius: 11,
    justifyContent: 'center',
    marginTop: 18,
    minHeight: 52,
  },
  resetText: { fontSize: 16, fontWeight: '700' },
});
