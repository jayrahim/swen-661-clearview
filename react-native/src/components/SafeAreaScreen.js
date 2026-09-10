import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const defaultEdges = ['top', 'left', 'right', 'bottom'];

/**
 * Shared full-screen safe-area shell for workflow screens that manage their
 * own scrolling and navigation presentation.
 */
export function SafeAreaScreen({ children, edges = defaultEdges, style }) {
  return (
    <SafeAreaView edges={edges} style={[styles.screen, style]}>
      {children}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
});
