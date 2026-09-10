import { Pressable, StyleSheet, Text } from 'react-native';

import { useClearViewTheme } from '../theme/useClearViewTheme';
import { layout, scaledFontSize, spacing } from '../theme/tokens';

/** A shared, accessible primary action used by future ClearView screens. */
export function PrimaryButton({
  label,
  onPress,
  accessibilityLabel = label,
  disabled = false,
}) {
  const { theme } = useClearViewTheme();

  return (
    <Pressable
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        { backgroundColor: theme.colors.primary },
        disabled && styles.disabled,
        pressed && !disabled && styles.pressed,
      ]}
    >
      <Text
        style={[
          styles.label,
          { color: theme.colors.surface, fontSize: scaledFontSize(16, theme) },
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    borderRadius: 12,
    justifyContent: 'center',
    minHeight: layout.minimumTouchTarget,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  disabled: {
    opacity: 0.5,
  },
  label: {
    fontWeight: '700',
  },
  pressed: {
    opacity: 0.85,
  },
});
