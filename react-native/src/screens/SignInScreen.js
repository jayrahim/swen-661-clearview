import { useState } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { PrimaryButton } from '../components/PrimaryButton';
import { ScreenContainer } from '../components/ScreenContainer';
import { colors, layout, spacing, typography } from '../theme/tokens';
import { useAccessibilityPreferences } from '../state/accessibilityPreferences';
import { resolveTheme, scaledFontSize } from '../theme/tokens';

export function SignInScreen({ onSignIn }) {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [prototypeMessage, setPrototypeMessage] = useState(null);
  const { preferences } = useAccessibilityPreferences();
  const theme = resolveTheme(preferences);

  return (
    <ScreenContainer>
      <View style={styles.content}>
        <Text style={styles.brand}>CareConnect</Text>
        <Text style={styles.product}>ClearView</Text>

        <Text style={[styles.title, { fontSize: scaledFontSize(26, theme) }]}>Sign in to manage your care</Text>
        <Text style={[styles.description, { fontSize: scaledFontSize(16, theme) }]}>
          Use your CareConnect account to view appointments, messages, and health information.
        </Text>

        <Text style={styles.fieldLabel}>Email</Text>
        <TextInput
          accessibilityLabel="Email address"
          autoCapitalize="none"
          autoComplete="email"
          defaultValue="maya.carter@example.com"
          keyboardType="email-address"
          style={styles.input}
        />

        <Text style={styles.fieldLabel}>Password</Text>
        <View style={styles.passwordField}>
          <TextInput
            accessibilityLabel="Password"
            autoComplete="current-password"
            defaultValue="clearview123"
            secureTextEntry={!passwordVisible}
            style={styles.passwordInput}
          />
          <Pressable
            accessibilityLabel={passwordVisible ? 'Hide password' : 'Show password'}
            accessibilityRole="button"
            onPress={() => setPasswordVisible((visible) => !visible)}
            style={styles.passwordToggle}
          >
            <Text style={styles.passwordToggleLabel}>{passwordVisible ? 'Hide' : 'Show'}</Text>
          </Pressable>
        </View>

        <PrimaryButton label="Sign in" onPress={onSignIn} />

        <Pressable
          accessibilityRole="button"
          onPress={() =>
            setPrototypeMessage('Password recovery is not available in this prototype.')
          }
          style={styles.forgotPassword}
        >
          <Text style={styles.forgotPasswordLabel}>Forgot password?</Text>
        </Pressable>

        {prototypeMessage ? (
          <Text accessibilityLiveRegion="polite" style={styles.prototypeMessage}>
            {prototypeMessage}
          </Text>
        ) : null}

        <View
          accessible
          accessibilityLabel="Accessibility information. Accessibility options are available after sign-in and can be saved for future sessions."
          style={styles.accessibilityNotice}
        >
          <Text style={styles.accessibilityNoticeText}>
            Accessibility options are available after sign-in and can be saved for future sessions.
          </Text>
        </View>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  accessibilityNotice: {
    backgroundColor: colors.infoBackground,
    borderColor: colors.infoBorder,
    borderRadius: 11,
    borderWidth: 1,
    marginTop: spacing.xl,
    padding: spacing.lg,
  },
  accessibilityNoticeText: {
    color: colors.primary,
    fontSize: typography.label,
    lineHeight: 20,
  },
  brand: {
    color: colors.primary,
    fontSize: 30,
    fontWeight: '700',
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: spacing.xl,
    paddingTop: 72,
    paddingBottom: spacing.xl,
  },
  description: {
    color: colors.mutedInk,
    fontSize: typography.body,
    lineHeight: 20,
    marginTop: spacing.sm,
  },
  fieldLabel: {
    color: colors.ink,
    fontSize: typography.label,
    fontWeight: '700',
    marginBottom: spacing.sm,
    marginTop: 26,
  },
  forgotPassword: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: layout.minimumTouchTarget,
    marginTop: spacing.sm,
  },
  forgotPasswordLabel: {
    color: colors.primary,
    fontSize: typography.body,
    fontWeight: '700',
  },
  input: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 10,
    borderWidth: 1,
    color: colors.ink,
    fontSize: typography.body,
    minHeight: 58,
    paddingHorizontal: spacing.lg,
  },
  passwordField: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 10,
    borderWidth: 1,
    flexDirection: 'row',
    minHeight: 58,
  },
  passwordInput: {
    color: colors.ink,
    flex: 1,
    fontSize: typography.body,
    minHeight: 56,
    paddingHorizontal: spacing.lg,
  },
  passwordToggle: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: layout.minimumTouchTarget,
    minWidth: layout.minimumTouchTarget,
    paddingHorizontal: spacing.sm,
  },
  passwordToggleLabel: {
    color: colors.primary,
    fontSize: typography.label,
    fontWeight: '700',
  },
  product: {
    color: '#614185',
    fontSize: typography.heading,
    fontWeight: '700',
    marginTop: spacing.xs,
  },
  prototypeMessage: {
    color: colors.primary,
    fontSize: typography.label,
    lineHeight: 20,
    marginTop: spacing.sm,
    textAlign: 'center',
  },
  title: {
    color: colors.ink,
    fontSize: 26,
    fontWeight: '700',
    marginTop: 36,
  },
});
