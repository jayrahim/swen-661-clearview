/**
 * Shared ClearView design tokens for the React Native prototype.
 *
 * Feature PRs should consume these values rather than recreating colors,
 * spacing, or accessibility target sizes in individual screens.
 */
export const colors = {
  background: '#F7F9FC',
  surface: '#FFFFFF',
  ink: '#182033',
  mutedInk: '#526074',
  primary: '#005A70',
  border: '#D9E2EA',
  infoBackground: '#E6F4FE',
  infoBorder: '#A8D8F0',
  mint: '#E8F7EF',
  mintInk: '#16744A',
  warning: '#FFF2D6',
  warningInk: '#9B5800',
  aqua: '#D9F3F8',
  blueTile: '#E6F4FE',
  purpleTile: '#F1E8F8',
};

export const highContrastColors = {
  ...colors,
  background: '#FFFFFF',
  surface: '#FFFFFF',
  ink: '#111827',
  mutedInk: '#4B5563',
  border: '#111827',
  infoBackground: '#FFFFFF',
  infoBorder: '#111827',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
};

export const layout = {
  bottomNavigationHeight: 76,
  minimumTouchTarget: 48,
  phoneMaxWidth: 480,
  tabletBreakpoint: 600,
  readingMaxWidth: 760,
  wideMaxWidth: 1120,
};

export const typography = {
  display: 32,
  title: 24,
  heading: 20,
  body: 16,
  label: 14,
};

export const borderWidths = {
  normal: 1,
  highContrast: 2,
};

export function resolveTheme(preferences) {
  return {
    isHighContrast: preferences.highContrast,
    colors: preferences.highContrast ? highContrastColors : colors,
    borderWidth: preferences.highContrast
      ? borderWidths.highContrast
      : borderWidths.normal,
    textScale: preferences.textSize.scale,
  };
}

export function scaledFontSize(size, theme) {
  return size * theme.textScale;
}
