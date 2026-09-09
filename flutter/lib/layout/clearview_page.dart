import 'package:flutter/material.dart';

/// Shared page-width constants for the ClearView layouts.
abstract final class ClearViewLayout {
  static const phoneMaxWidth = 480.0;
}

/// Centered, phone-width layout used by unauthenticated screens.
///
/// Authenticated screens use [ClearViewResponsiveScaffold] instead so they can
/// present the shared phone and tablet navigation patterns.
class AppPage extends StatelessWidget {
  const AppPage({super.key, required this.child});

  final Widget child;

  @override
  Widget build(BuildContext context) => SafeArea(
    child: Center(
      child: ConstrainedBox(
        constraints: const BoxConstraints(
          maxWidth: ClearViewLayout.phoneMaxWidth,
        ),
        child: child,
      ),
    ),
  );
}
