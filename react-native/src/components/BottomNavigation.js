import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { borderWidths, colors, layout, spacing } from '../theme/tokens';

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
export function BottomNavigation({ activeItem = 'home', onNavigate = {} }) {
  return (
    <View accessibilityRole="tablist" style={styles.navigation}>
      {navigationItems.map((item) => {
        const isActive = item.key === activeItem;
        const onPress = onNavigate[item.key];
        const color = isActive ? colors.primary : colors.mutedInk;
        const content = (
          <>
            <Ionicons color={color} name={item.icon} size={20} />
            <Text
              style={[styles.label, { color }, isActive && styles.activeLabel]}
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
              accessibilityState={{ selected: isActive }}
              key={item.key}
              style={styles.item}
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
            style={({ pressed }) => [styles.item, pressed && styles.pressed]}
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
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderTopWidth: borderWidths.normal,
    flexDirection: 'row',
    minHeight: 76,
  },
  pressed: {
    opacity: 0.7,
  },
});
