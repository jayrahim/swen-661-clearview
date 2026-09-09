import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AppNavigator } from './src/navigation/AppNavigator';
import { AccessibilityPreferencesProvider } from './src/state/accessibilityPreferences';

export default function App() {
  return (
    <>
      <StatusBar style="dark" />
      <SafeAreaProvider>
        <AccessibilityPreferencesProvider>
          <AppNavigator />
        </AccessibilityPreferencesProvider>
      </SafeAreaProvider>
    </>
  );
}
