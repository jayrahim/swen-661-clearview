import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, spacing } from '../theme/tokens';

/** A dashboard tile that only becomes interactive when its feature is ready. */
export function QuickAccessTile({ item, onPress, style }) {
  const content = (
    <>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={[styles.subtitle, { color: item.subtitleColor }]}>
        {item.subtitle}
      </Text>
    </>
  );
  const sharedProps = {
    accessibilityLabel: `${item.title}, ${item.subtitle}`,
    style: [styles.tile, { backgroundColor: item.backgroundColor }, style],
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
        { backgroundColor: item.backgroundColor },
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
    fontSize: 14,
    marginTop: spacing.md,
  },
  tile: {
    borderRadius: 12,
    minHeight: 92,
    padding: spacing.lg,
  },
  title: {
    color: colors.ink,
    fontSize: 16,
    fontWeight: '700',
  },
});
