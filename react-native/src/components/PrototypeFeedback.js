import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { layout, scaledFontSize, spacing } from '../theme/tokens';
import { useClearViewTheme } from '../theme/useClearViewTheme';

const feedbackDuration = 4000;
const defaultFeedbackBottomOffset = spacing.lg;
const PrototypeFeedbackContext = createContext(null);

/**
 * ClearView's React Native equivalent of Flutter's floating prototype snackbar.
 * New messages replace the current message and dismiss after a short interval.
 */
export function PrototypeFeedbackProvider({ children }) {
  const [message, setMessage] = useState(null);
  const [bottomOffset, setBottomOffset] = useState(defaultFeedbackBottomOffset);
  const { theme } = useClearViewTheme();
  const showPrototypeFeedback = useCallback(
    (nextMessage) => setMessage(nextMessage),
    [],
  );

  useEffect(() => {
    if (!message) return undefined;

    const timeout = setTimeout(() => setMessage(null), feedbackDuration);
    return () => clearTimeout(timeout);
  }, [message]);

  const value = useMemo(
    () => ({ showPrototypeFeedback, setBottomOffset }),
    [showPrototypeFeedback],
  );

  return (
    <PrototypeFeedbackContext.Provider value={value}>
      <View style={styles.root}>
        {children}
        {message ? (
          <View
            accessibilityLiveRegion="polite"
            accessibilityRole="alert"
            style={[
              styles.feedback,
              {
                backgroundColor: theme.colors.ink,
                borderColor: theme.colors.border,
                borderWidth: theme.isHighContrast ? theme.borderWidth : 0,
                bottom: bottomOffset,
              },
            ]}
          >
            <Text
              style={[
                {
                  color: theme.colors.surface,
                  fontSize: scaledFontSize(16, theme),
                },
              ]}
            >
              {message}
            </Text>
          </View>
        ) : null}
      </View>
    </PrototypeFeedbackContext.Provider>
  );
}

export function usePrototypeFeedback() {
  const value = useContext(PrototypeFeedbackContext);
  if (!value) {
    throw new Error('usePrototypeFeedback must be used within its provider.');
  }
  return { showPrototypeFeedback: value.showPrototypeFeedback };
}

/**
 * Positions feedback above a screen's persistent navigation when present.
 * The current navigator mounts only one active anchor at a time.
 */
export function PrototypeFeedbackAnchor({
  bottomOffset = defaultFeedbackBottomOffset,
}) {
  const value = useContext(PrototypeFeedbackContext);

  useEffect(() => {
    value.setBottomOffset(bottomOffset);
    return () => value.setBottomOffset(defaultFeedbackBottomOffset);
  }, [bottomOffset, value]);

  return null;
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  feedback: {
    borderRadius: 4,
    elevation: 6,
    justifyContent: 'center',
    left: spacing.xl,
    minHeight: layout.minimumTouchTarget,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    position: 'absolute',
    right: spacing.xl,
  },
});
