import { StyleSheet, View } from 'react-native';

import { useClearViewTheme } from '../theme/useClearViewTheme';
import { spacing } from '../theme/tokens';

/** Shared bordered surface for ClearView content and action cards. */
export function AppCard({ children, style }) {
  const { theme } = useClearViewTheme();
  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.border,
          borderWidth: theme.borderWidth,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 14,
    padding: spacing.lg,
  },
});
