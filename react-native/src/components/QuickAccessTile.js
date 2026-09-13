import { Pressable, StyleSheet, Text, View } from 'react-native';

import { scaledFontSize, spacing } from '../theme/tokens';
import { useClearViewTheme } from '../theme/useClearViewTheme';

/** A dashboard tile that only becomes interactive when its feature is ready. */
export function QuickAccessTile({ item, onPress, style }) {
  const { theme } = useClearViewTheme();
  const tileSurface = {
    backgroundColor: theme.isHighContrast
      ? theme.colors.surface
      : item.backgroundColor,
    borderColor: theme.colors.border,
    borderWidth: theme.isHighContrast ? theme.borderWidth : 0,
  };
  const content = (
    <>
      <Text
        style={[
          styles.title,
          { color: theme.colors.ink, fontSize: scaledFontSize(16, theme) },
        ]}
      >
        {item.title}
      </Text>
      <Text
        style={[
          styles.subtitle,
          {
            color: theme.isHighContrast
              ? theme.colors.primary
              : item.subtitleColor,
            fontSize: scaledFontSize(14, theme),
          },
        ]}
      >
        {item.subtitle}
      </Text>
    </>
  );
  const sharedProps = {
    accessibilityLabel: `${item.title}, ${item.subtitle}`,
    style: [styles.tile, tileSurface, style],
  };

  if (!onPress) {
    return <View {...sharedProps}>{content}</View>;
  }

  return (
    <Pressable
      {...sharedProps}
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.tile,
        tileSurface,
        style,
        pressed && styles.pressed,
      ]}
    >
      {content}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressed: {
    opacity: 0.8,
  },
  subtitle: {
    marginTop: spacing.md,
  },
  tile: {
    borderRadius: 12,
    minHeight: 92,
    padding: spacing.lg,
  },
  title: {
    fontWeight: '700',
  },
});
