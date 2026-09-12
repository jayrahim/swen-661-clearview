import { layout } from '../theme/tokens';

export function responsiveLayoutFor({ height, width }) {
  // Match Flutter's shortest-side policy: a wide phone in landscape remains
  // a phone layout rather than switching unexpectedly to the tablet rail.
  const isTablet = Math.min(height, width) >= layout.tabletBreakpoint;
  const isLandscape = width > height;

  return {
    contentMaxWidth: isTablet
      ? isLandscape
        ? layout.wideMaxWidth
        : layout.readingMaxWidth
      : layout.phoneMaxWidth,
    isLandscape,
    isTablet,
  };
}
