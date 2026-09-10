import {
  borderWidths,
  colors,
  highContrastColors,
  layout,
  resolveTheme,
} from '../src/theme/tokens';

describe('ClearView design tokens', () => {
  test('reserves an accessible minimum interactive target', () => {
    expect(layout.minimumTouchTarget).toBeGreaterThanOrEqual(48);
  });

  test('provides a distinct high-contrast palette and stronger boundary', () => {
    expect(highContrastColors.background).not.toBe(colors.background);
    expect(highContrastColors.border).not.toBe(colors.border);
    expect(borderWidths.highContrast).toBeGreaterThan(borderWidths.normal);
  });

  test('exposes high-contrast intent alongside resolved tokens', () => {
    expect(
      resolveTheme({ highContrast: true, textSize: { scale: 1 } }),
    ).toMatchObject({
      isHighContrast: true,
    });
  });
});
