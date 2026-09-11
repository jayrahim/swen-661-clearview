import { Text } from 'react-native';
import { screen } from '@testing-library/react-native';

import { ResponsiveContent } from '../src/components/ResponsiveContent';
import { RootScreenLayout } from '../src/components/RootScreenLayout';
import { ScreenContainer } from '../src/components/ScreenContainer';
import { appointmentRepository } from '../src/data/appointments';
import { responsiveLayoutFor } from '../src/layout/responsiveLayoutPolicy';
import { AppointmentDetailScreen } from '../src/screens/AppointmentDetailScreen';
import { DashboardScreen } from '../src/screens/DashboardScreen';
import {
  defaultAccessibilityPreferences,
  textSizeOptions,
} from '../src/state/accessibilityPreferences';
import { renderWithProviders } from '../src/test-utils/renderWithProviders';
import { layout, resolveTheme, scaledFontSize } from '../src/theme/tokens';

let mockResponsiveLayout = {
  contentMaxWidth: 480,
  isLandscape: false,
  isTablet: false,
};

jest.mock('../src/layout/useResponsiveLayout', () => ({
  useResponsiveLayout: () => mockResponsiveLayout,
}));

describe('responsive layout', () => {
  beforeEach(() => {
    mockResponsiveLayout = responsiveLayoutFor({ height: 844, width: 390 });
  });

  test('keeps the phone content policy and bottom navigation', async () => {
    await renderWithProviders(
      <RootScreenLayout activeItem="home" onNavigate={{}}>
        <ResponsiveContent testID="responsive-content">
          <Text>Phone content</Text>
        </ResponsiveContent>
      </RootScreenLayout>,
    );

    expect(screen.getByTestId('bottom-navigation')).toBeVisible();
    expect(screen.queryByTestId('side-navigation')).toBeNull();
    expect(screen.getByTestId('responsive-content').props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ maxWidth: layout.phoneMaxWidth }),
      ]),
    );
  });

  test('uses a side navigation rail and wider content in tablet portrait', async () => {
    mockResponsiveLayout = responsiveLayoutFor({ height: 1194, width: 834 });

    await renderWithProviders(
      <RootScreenLayout activeItem="home" onNavigate={{}}>
        <ResponsiveContent testID="responsive-content">
          <Text>Tablet content</Text>
        </ResponsiveContent>
      </RootScreenLayout>,
    );

    expect(screen.getByTestId('side-navigation')).toBeVisible();
    expect(screen.queryByTestId('bottom-navigation')).toBeNull();
    expect(screen.getByTestId('responsive-content').props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ maxWidth: layout.readingMaxWidth }),
      ]),
    );
  });

  test('uses the wide policy in tablet landscape', () => {
    expect(responsiveLayoutFor({ height: 834, width: 1194 })).toEqual({
      contentMaxWidth: layout.wideMaxWidth,
      isLandscape: true,
      isTablet: true,
    });
  });

  test('keeps a wide phone in landscape on the phone navigation presentation', async () => {
    mockResponsiveLayout = responsiveLayoutFor({ height: 428, width: 926 });

    await renderWithProviders(
      <RootScreenLayout activeItem="home" onNavigate={{}}>
        <Text>Landscape phone content</Text>
      </RootScreenLayout>,
    );

    expect(screen.getByTestId('bottom-navigation')).toBeVisible();
    expect(screen.queryByTestId('side-navigation')).toBeNull();
    expect(mockResponsiveLayout.contentMaxWidth).toBe(layout.phoneMaxWidth);
  });

  test('allows ScreenContainer content to grow beyond the phone width on tablets', async () => {
    mockResponsiveLayout = responsiveLayoutFor({ height: 834, width: 1194 });

    await renderWithProviders(
      <ScreenContainer safeArea={false} scroll={false}>
        <Text>Wide screen content</Text>
      </ScreenContainer>,
    );

    expect(screen.getByTestId('screen-container-content').props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ maxWidth: layout.wideMaxWidth }),
      ]),
    );
  });

  test('keeps a side rail on tablet detail routes without adding phone navigation', async () => {
    mockResponsiveLayout = responsiveLayoutFor({ height: 1194, width: 834 });

    await renderWithProviders(
      <AppointmentDetailScreen
        appointment={appointmentRepository.getById('appt-1')}
        onBack={jest.fn()}
        onNavigate={{ home: jest.fn() }}
      />,
    );

    expect(screen.getByTestId('side-navigation')).toBeVisible();
    expect(screen.queryByTestId('bottom-navigation')).toBeNull();
  });

  test('keeps Reduced Clutter and High Contrast compatible with tablet navigation', async () => {
    mockResponsiveLayout = responsiveLayoutFor({ height: 1194, width: 834 });

    const tabletPreferences = {
      ...defaultAccessibilityPreferences,
      highContrast: true,
      reducedClutter: true,
      textSize: textSizeOptions[2],
    };

    await renderWithProviders(<DashboardScreen />, {
      initialPreferences: tabletPreferences,
    });
    expect(screen.getByText('Home')).toHaveStyle({
      fontSize: scaledFontSize(11, resolveTheme(tabletPreferences)),
    });

    expect(screen.getByTestId('side-navigation')).toHaveStyle({
      backgroundColor: '#FFFFFF',
      borderColor: '#111827',
      borderRightWidth: 2,
    });
    expect(screen.queryByLabelText(/Messages, .* unread/)).toBeNull();
    expect(
      screen.getByText('Text: Extra large • High contrast: On'),
    ).toBeVisible();
  });
});
