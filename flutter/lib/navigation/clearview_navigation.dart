import 'package:flutter/material.dart';

/// Shared route-stack operations for the ClearView prototype.
///
/// Screens retain ownership of their destinations and callbacks, while this
/// helper keeps phone bottom navigation and tablet side-navigation transitions
/// consistent.
abstract final class ClearViewNavigation {
  static void push(BuildContext context, Widget destination) {
    Navigator.of(context)
        .push(MaterialPageRoute<void>(builder: (_) => destination));
  }

  static void replace(BuildContext context, Widget destination) {
    Navigator.of(context)
        .pushReplacement(MaterialPageRoute<void>(builder: (_) => destination));
  }

  /// Opens a root-tab destination while preserving the initial dashboard route.
  ///
  /// Detail screens use this for cross-tab navigation so Back never reveals a
  /// stale detail route beneath a newly selected root tab.
  static void openRootTab(BuildContext context, Widget destination) {
    Navigator.of(context).pushAndRemoveUntil(
      MaterialPageRoute<void>(builder: (_) => destination),
      (route) => route.isFirst,
    );
  }

  static void returnHome(BuildContext context) {
    Navigator.of(context).popUntil((route) => route.isFirst);
  }
}
