import 'package:flutter/material.dart';

/// Shows consistent, visible feedback for controls outside this prototype's
/// implemented workflows.
///
/// A floating message remains visible above both phone bottom navigation and
/// tablet side-navigation layouts.
void showPrototypeFeedback(BuildContext context, String message) {
  final messenger = ScaffoldMessenger.of(context);
  messenger.hideCurrentSnackBar();
  messenger.showSnackBar(
    SnackBar(behavior: SnackBarBehavior.floating, content: Text(message)),
  );
}
