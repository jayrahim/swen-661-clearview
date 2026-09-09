import { StyleSheet, View } from 'react-native';

import { borderWidths, colors, spacing } from '../theme/tokens';

/** Shared bordered surface for ClearView content and action cards. */
export function AppCard({ children, style }) {
  return <View style={[styles.card, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 14,
    borderWidth: borderWidths.normal,
    padding: spacing.lg,
  },
});
