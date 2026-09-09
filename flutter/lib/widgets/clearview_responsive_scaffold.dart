import 'package:flutter/material.dart';

import '../layout/clearview_page.dart';
import 'clearview_navigation_controls.dart';

/// Shared shell for authenticated screens.
///
/// Phone layouts retain the approved bottom navigation. Tablet layouts use a
/// side rail so content has the available horizontal space without stretching
/// the phone navigation across a wide display. Root-tab screens should use
/// this shell so each navigation destination preserves that adaptive behavior.
class ClearViewResponsiveScaffold extends StatelessWidget {
  const ClearViewResponsiveScaffold({
    super.key,
    required this.child,
    this.onSettingsTap,
    this.onHomeTap,
    this.onVisitsTap,
    this.onMessagesTap,
    this.onRecordsTap,
    this.selectedItem = ClearViewNavigationItem.home,
    this.isRootTab = true,
    this.contentWidth = ClearViewContentWidth.wide,
  });

  final Widget child;
  final VoidCallback? onSettingsTap;
  final VoidCallback? onHomeTap;
  final VoidCallback? onVisitsTap;
  final VoidCallback? onMessagesTap;
  final VoidCallback? onRecordsTap;
  final ClearViewNavigationItem selectedItem;

  /// Root tabs show persistent phone navigation; stack-pushed subpages retain
  /// their approved back-arrow presentation instead.
  final bool isRootTab;
  final ClearViewContentWidth contentWidth;

  @override
  Widget build(BuildContext context) {
    final isTablet = MediaQuery.sizeOf(context).shortestSide >= 600;
    final navigation = ClearViewBottomNavigation(
      selectedItem: selectedItem,
      onHomeTap: onHomeTap,
      onVisitsTap: onVisitsTap,
      onMessagesTap: onMessagesTap,
      onRecordsTap: onRecordsTap,
      onSettingsTap: onSettingsTap,
    );
    final content = Center(
      child: ConstrainedBox(
        constraints: BoxConstraints(
          maxWidth: isTablet
              ? contentWidth.maxWidth
              : ClearViewLayout.phoneMaxWidth,
        ),
        child: child,
      ),
    );

    return Scaffold(
      body: SafeArea(
        child: isTablet
            ? Row(
                children: [
                  ClearViewSideNavigation(
                    selectedItem: selectedItem,
                    onHomeTap: onHomeTap,
                    onVisitsTap: onVisitsTap,
                    onMessagesTap: onMessagesTap,
                    onRecordsTap: onRecordsTap,
                    onSettingsTap: onSettingsTap,
                  ),
                  Expanded(child: content),
                ],
              )
            : isRootTab
            ? Column(
                children: [
                  Expanded(child: content),
                  navigation,
                ],
              )
            : content,
      ),
    );
  }
}

enum ClearViewContentWidth {
  reading(760),
  wide(1120);

  const ClearViewContentWidth(this.maxWidth);

  final double maxWidth;
}
