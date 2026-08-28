import 'package:flutter/material.dart';

import 'screens/sign_in_screen.dart';
import 'theme/app_theme.dart';

void main() => runApp(const ClearViewApp());

class ClearViewApp extends StatelessWidget {
  const ClearViewApp({super.key});

  @override
  Widget build(BuildContext context) => MaterialApp(
    title: 'CareConnect ClearView',
    debugShowCheckedModeBanner: false,
    theme: AppTheme.lightTheme,
    home: const SignInScreen(),
  );
}
