import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { layout, scaledFontSize, spacing } from '../theme/tokens';
import { useClearViewTheme } from '../theme/useClearViewTheme';

const navigationItems = [
  { key: 'home', label: 'Home', icon: 'home' },
  { key: 'visits', label: 'Visits', icon: 'calendar-outline' },
  { key: 'messages', label: 'Messages', icon: 'mail-outline' },
  { key: 'records', label: 'Records', icon: 'list-outline' },
  { key: 'settings', label: 'Settings', icon: 'settings-outline' },
];

/**
 * Shared root-screen navigation. Items without a handler remain informational
 * until their feature workflow is implemented, avoiding false button semantics.
 */
export function BottomNavigation({
  activeItem = 'home',
  onNavigate = {},
  orientation = 'bottom',
}) {
  const isSideNavigation = orientation === 'side';
  const { theme } = useClearViewTheme();
  const navigationStyle = {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    ...(isSideNavigation
      ? { borderRightWidth: theme.borderWidth }
      : { borderTopWidth: theme.borderWidth }),
  };

  return (
    <View
      accessibilityRole="tablist"
      style={[
        styles.navigation,
        isSideNavigation && styles.sideNavigation,
        navigationStyle,
      ]}
      testID={isSideNavigation ? 'side-navigation' : 'bottom-navigation'}
    >
      {navigationItems.map((item) => {
        const isActive = item.key === activeItem;
        const onPress = onNavigate[item.key];
        const color = isActive ? theme.colors.primary : theme.colors.mutedInk;
        const content = (
          <>
            <Ionicons color={color} name={item.icon} size={20} />
            <Text
              style={[
                styles.label,
                { color, fontSize: scaledFontSize(11, theme) },
                isActive && styles.activeLabel,
              ]}
            >
              {item.label}
            </Text>
          </>
        );

        if (!onPress) {
          return (
            <View
              accessibilityLabel={item.label}
              accessibilityRole="tab"
              accessibilityState={{ disabled: true, selected: isActive }}
              key={item.key}
              style={[styles.item, isSideNavigation && styles.sideItem]}
            >
              {content}
            </View>
          );
        }

        return (
          <Pressable
            accessibilityLabel={item.label}
            accessibilityRole="tab"
            accessibilityState={{ selected: isActive }}
            key={item.key}
            onPress={onPress}
            style={({ pressed }) => [
              styles.item,
              isSideNavigation && styles.sideItem,
              pressed && styles.pressed,
            ]}
          >
            {content}
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  activeLabel: {
    fontWeight: '700',
  },
  item: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    minHeight: layout.minimumTouchTarget,
    paddingHorizontal: spacing.xs,
    paddingVertical: spacing.sm,
  },
  label: {
    fontSize: 11,
    marginTop: spacing.xs,
  },
  navigation: {
    flexDirection: 'row',
    minHeight: layout.bottomNavigationHeight,
  },
  sideItem: {
    alignItems: 'flex-start',
    flex: 0,
    paddingHorizontal: spacing.lg,
  },
  sideNavigation: {
    borderTopWidth: 0,
    flexDirection: 'column',
    minWidth: 132,
  },
  pressed: {
    opacity: 0.7,
  },
});
