import { StyleSheet, View } from 'react-native';

import { useResponsiveLayout } from '../layout/useResponsiveLayout';
import { layout } from '../theme/tokens';
import { BottomNavigation } from './BottomNavigation';
import { SafeAreaScreen } from './SafeAreaScreen';

/**
 * Shared root-route shell. Phone roots retain bottom tabs; tablet roots use
 * the same tab semantics in a persistent vertical navigation rail.
 */
export function RootScreenLayout({
  activeItem,
  children,
  onNavigate,
  showPhoneNavigation = true,
  style,
}) {
  const { isTablet } = useResponsiveLayout();

  return (
    <SafeAreaScreen style={style}>
      <View style={[styles.shell, isTablet && styles.tabletShell]}>
        {isTablet && (
          <BottomNavigation
            activeItem={activeItem}
            onNavigate={onNavigate}
            orientation="side"
          />
        )}
        <View style={styles.content}>{children}</View>
        {!isTablet && showPhoneNavigation && (
          <BottomNavigation activeItem={activeItem} onNavigate={onNavigate} />
        )}
      </View>
    </SafeAreaScreen>
  );
}

export const rootNavigationFeedbackOffset = (isTablet) =>
  isTablet ? layout.minimumTouchTarget : layout.bottomNavigationHeight;

const styles = StyleSheet.create({
  content: {
    flex: 1,
  },
  shell: {
    flex: 1,
  },
  tabletShell: {
    flexDirection: 'row',
  },
});
