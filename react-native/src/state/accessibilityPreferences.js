import { createContext, useContext, useMemo, useReducer } from 'react';

export const textSizeOptions = [
  { id: 'standard', label: 'Standard', scale: 0.9 },
  { id: 'large', label: 'Large', scale: 1 },
  { id: 'extra-large', label: 'Extra large', scale: 1.15 },
];

export const defaultAccessibilityPreferences = Object.freeze({
  textSize: textSizeOptions[1],
  highContrast: true,
  reducedClutter: false,
  colorPreference: 'Cool',
});

export function accessibilityPreferencesReducer(state, action) {
  switch (action.type) {
    case 'cycle-text-size': {
      const index = textSizeOptions.findIndex(
        (option) => option.id === state.textSize.id,
      );
      return {
        ...state,
        textSize: textSizeOptions[(index + 1) % textSizeOptions.length],
      };
    }
    case 'toggle-high-contrast':
      return { ...state, highContrast: !state.highContrast };
    case 'toggle-reduced-clutter':
      return { ...state, reducedClutter: !state.reducedClutter };
    case 'reset':
      return defaultAccessibilityPreferences;
    default:
      return state;
  }
}

const AccessibilityPreferencesContext = createContext(null);

export function AccessibilityPreferencesProvider({
  children,
  initialPreferences,
}) {
  const [preferences, dispatch] = useReducer(
    accessibilityPreferencesReducer,
    initialPreferences ?? defaultAccessibilityPreferences,
  );
  const value = useMemo(() => ({ preferences, dispatch }), [preferences]);

  return (
    <AccessibilityPreferencesContext.Provider value={value}>
      {children}
    </AccessibilityPreferencesContext.Provider>
  );
}

export function useAccessibilityPreferences() {
  const value = useContext(AccessibilityPreferencesContext);
  if (!value) {
    throw new Error(
      'useAccessibilityPreferences must be used within its provider.',
    );
  }
  return value;
}
