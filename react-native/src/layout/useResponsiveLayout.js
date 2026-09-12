import { useWindowDimensions } from 'react-native';

import { responsiveLayoutFor } from './responsiveLayoutPolicy';

export function useResponsiveLayout() {
  return responsiveLayoutFor(useWindowDimensions());
}
