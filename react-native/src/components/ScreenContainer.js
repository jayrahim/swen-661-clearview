import { ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors } from '../theme/tokens';
import { ResponsiveContent } from './ResponsiveContent';

/** Centers phone-first ClearView content while allowing it to grow on tablets. */
export function ScreenContainer({
  children,
  safeArea = true,
  scroll = true,
  style,
}) {
  const content = (
    <ResponsiveContent style={style} testID="screen-container-content">
      {children}
    </ResponsiveContent>
  );

  const body = scroll ? (
    <ScrollView contentContainerStyle={styles.scrollContent}>
      {content}
    </ScrollView>
  ) : (
    content
  );

  return safeArea ? (
    <SafeAreaView style={styles.safeArea}>{body}</SafeAreaView>
  ) : (
    body
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: colors.background,
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
});
