import { useAccessibilityPreferences } from '../state/accessibilityPreferences';
import { resolveTheme } from './tokens';

/** Returns the current preferences together with the tokens derived from them. */
export function useClearViewTheme() {
  const { preferences } = useAccessibilityPreferences();

  return { preferences, theme: resolveTheme(preferences) };
}
