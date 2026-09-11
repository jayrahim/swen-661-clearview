import { StyleSheet, View } from 'react-native';

import { useResponsiveLayout } from '../layout/useResponsiveLayout';

/**
 * Keeps phone content comfortably narrow while using tablet space for
 * readable two-column and wide layouts.
 */
export function ResponsiveContent({ children, style, testID }) {
  const { contentMaxWidth } = useResponsiveLayout();

  return (
    <View
      style={[styles.content, { maxWidth: contentMaxWidth }, style]}
      testID={testID}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    alignSelf: 'center',
    width: '100%',
  },
});
