import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import 'screens/sign_in_screen.dart';
import 'state/accessibility_preferences.dart';
import 'theme/app_theme.dart';

void main() => runApp(const ProviderScope(child: ClearViewApp()));

class ClearViewApp extends ConsumerWidget {
  const ClearViewApp({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final preferences = ref.watch(accessibilityPreferencesProvider);
    return MaterialApp(
      title: 'CareConnect ClearView',
      debugShowCheckedModeBanner: false,
      theme: AppTheme.lightTheme(highContrast: preferences.highContrast),
      builder: (context, child) {
        final systemScale = MediaQuery.textScalerOf(context).scale(1);
        return MediaQuery(
          data: MediaQuery.of(context).copyWith(
            textScaler: TextScaler.linear(
              systemScale * preferences.textSize.scaleFactor,
            ),
          ),
          child: child ?? const SizedBox.shrink(),
        );
      },
      home: const SignInScreen(),
    );
  }
}
