import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {
  colors,
  layout,
  spacing,
  typography,
} from '../theme/tokens';

export function PrototypeNoticeModal({
  visible,
  title,
  message,
  onClose,
}) {
  return (
    <Modal
      animationType="fade"
      onRequestClose={onClose}
      transparent
      visible={visible}
    >
      <View style={styles.overlay}>
        <View
          accessibilityRole="alert"
          accessible
          style={styles.dialog}
        >
          <Text accessibilityRole="header" style={styles.title}>
            {title}
          </Text>

          <Text style={styles.message}>
            {message}
          </Text>

          <Pressable
            accessibilityLabel="Close prototype notice"
            accessibilityRole="button"
            onPress={onClose}
            style={({ pressed }) => [
              styles.button,
              pressed && styles.pressed,
            ]}
          >
            <Text style={styles.buttonText}>
              OK
            </Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    alignSelf: 'flex-end',
    justifyContent: 'center',
    marginTop: spacing.lg,
    minHeight: layout.minimumTouchTarget,
    minWidth: layout.minimumTouchTarget * 2,
    paddingHorizontal: spacing.lg,
  },
  buttonText: {
    color: colors.primary,
    fontSize: typography.body,
    fontWeight: '700',
  },
  dialog: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 16,
    borderWidth: 1,
    maxWidth: 420,
    padding: spacing.xl,
    width: '88%',
  },
  message: {
    color: colors.ink,
    fontSize: typography.body,
    lineHeight: 27,
    marginTop: spacing.md,
  },
  overlay: {
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    flex: 1,
    justifyContent: 'center',
    padding: spacing.lg,
  },
  pressed: {
    opacity: 0.7,
  },
  title: {
    color: colors.ink,
    fontSize: 22,
    fontWeight: '700',
  },
});