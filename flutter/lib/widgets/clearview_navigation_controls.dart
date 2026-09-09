import 'package:flutter/material.dart';

import '../theme/clearview_tokens.dart';

enum ClearViewNavigationItem { home, visits, messages, records, settings }

class ClearViewSideNavigation extends StatelessWidget {
  const ClearViewSideNavigation({
    super.key,
    this.onSettingsTap,
    this.onHomeTap,
    this.onVisitsTap,
    this.onMessagesTap,
    this.onRecordsTap,
    this.selectedItem = ClearViewNavigationItem.home,
  });

  final VoidCallback? onSettingsTap;
  final VoidCallback? onHomeTap;
  final VoidCallback? onVisitsTap;
  final VoidCallback? onMessagesTap;
  final VoidCallback? onRecordsTap;
  final ClearViewNavigationItem selectedItem;

  @override
  Widget build(BuildContext context) {
    final tokens = context.clearViewTokens;
    return Container(
      key: const Key('clearview-side-navigation'),
      width: 104,
      decoration: BoxDecoration(
        color: tokens.surface,
        border: Border(
          right: BorderSide(color: tokens.border, width: tokens.borderWidth),
        ),
      ),
      child: ListView(
        padding: const EdgeInsets.only(top: 20),
        children: [
          _SideNavigationItem(
            icon: Icons.circle,
            label: 'Home',
            isSelected: selectedItem == ClearViewNavigationItem.home,
            onTap: onHomeTap,
          ),
          _SideNavigationItem(
            icon: Icons.calendar_today_outlined,
            label: 'Visits',
            isSelected: selectedItem == ClearViewNavigationItem.visits,
            onTap: onVisitsTap,
          ),
          _SideNavigationItem(
            icon: Icons.mail_outline,
            label: 'Messages',
            isSelected: selectedItem == ClearViewNavigationItem.messages,
            onTap: onMessagesTap,
          ),
          _SideNavigationItem(
            icon: Icons.view_headline_outlined,
            label: 'Records',
            isSelected: selectedItem == ClearViewNavigationItem.records,
            onTap: onRecordsTap,
          ),
          _SideNavigationItem(
            icon: Icons.settings,
            label: 'Settings',
            isSelected: selectedItem == ClearViewNavigationItem.settings,
            onTap: onSettingsTap,
          ),
        ],
      ),
    );
  }
}

class _SideNavigationItem extends StatelessWidget {
  const _SideNavigationItem({
    required this.icon,
    required this.label,
    this.isSelected = false,
    this.onTap,
  });

  final IconData icon;
  final String label;
  final bool isSelected;
  final VoidCallback? onTap;

  @override
  Widget build(BuildContext context) {
    final tokens = context.clearViewTokens;
    final color = isSelected ? tokens.primary : tokens.mutedInk;
    final content = ConstrainedBox(
      constraints: const BoxConstraints(minWidth: 64, minHeight: 64),
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 6),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(icon, size: 20, color: color),
            const SizedBox(height: 5),
            Text(
              label,
              textAlign: TextAlign.center,
              style: TextStyle(
                color: color,
                fontSize: 12,
                fontWeight: isSelected ? FontWeight.w700 : FontWeight.w400,
              ),
            ),
          ],
        ),
      ),
    );
    return Semantics(
      button: onTap != null,
      selected: isSelected,
      label: label,
      child: onTap == null ? content : InkWell(onTap: onTap, child: content),
    );
  }
}

class ClearViewBottomNavigation extends StatelessWidget {
  const ClearViewBottomNavigation({
    super.key,
    this.onSettingsTap,
    this.onHomeTap,
    this.onVisitsTap,
    this.onMessagesTap,
    this.onRecordsTap,
    this.selectedItem = ClearViewNavigationItem.home,
  });

  final VoidCallback? onSettingsTap;
  final VoidCallback? onHomeTap;
  final VoidCallback? onVisitsTap;
  final VoidCallback? onMessagesTap;
  final VoidCallback? onRecordsTap;
  final ClearViewNavigationItem selectedItem;

  @override
  Widget build(BuildContext context) {
    final textScale = MediaQuery.textScalerOf(context).scale(1);
    final tokens = context.clearViewTokens;
    return Container(
      height: 88 + ((textScale - 1).clamp(0, 1) * 40),
      decoration: BoxDecoration(
        color: tokens.surface,
        border: Border(
          top: BorderSide(color: tokens.border, width: tokens.borderWidth),
        ),
      ),
      child: Row(
        children: [
          _NavItem(
            icon: Icons.circle,
            label: 'Home',
            isSelected: selectedItem == ClearViewNavigationItem.home,
            onTap: onHomeTap,
          ),
          _NavItem(
            icon: Icons.calendar_today_outlined,
            label: 'Visits',
            isSelected: selectedItem == ClearViewNavigationItem.visits,
            onTap: onVisitsTap,
          ),
          _NavItem(
            icon: Icons.mail_outline,
            label: 'Messages',
            isSelected: selectedItem == ClearViewNavigationItem.messages,
            onTap: onMessagesTap,
          ),
          _NavItem(
            icon: Icons.view_headline_outlined,
            label: 'Records',
            isSelected: selectedItem == ClearViewNavigationItem.records,
            onTap: onRecordsTap,
          ),
          _NavItem(
            icon: Icons.settings,
            label: 'Settings',
            isSelected: selectedItem == ClearViewNavigationItem.settings,
            onTap: onSettingsTap,
          ),
        ],
      ),
    );
  }
}

class _NavItem extends StatelessWidget {
  const _NavItem({
    required this.icon,
    required this.label,
    this.isSelected = false,
    this.onTap,
  });

  final IconData icon;
  final String label;
  final bool isSelected;
  final VoidCallback? onTap;

  @override
  Widget build(BuildContext context) {
    final tokens = context.clearViewTokens;
    final color = isSelected ? tokens.primary : tokens.mutedInk;
    final content = _BottomNavigationItemContent(
      icon: icon,
      label: label,
      color: color,
      isSelected: isSelected,
    );
    return Expanded(
      child: Semantics(
        button: onTap != null,
        selected: isSelected,
        label: label,
        child: onTap == null ? content : InkWell(onTap: onTap, child: content),
      ),
    );
  }
}

class _BottomNavigationItemContent extends StatelessWidget {
  const _BottomNavigationItemContent({
    required this.icon,
    required this.label,
    required this.color,
    required this.isSelected,
  });

  final IconData icon;
  final String label;
  final Color color;
  final bool isSelected;

  @override
  Widget build(BuildContext context) => Column(
    mainAxisAlignment: MainAxisAlignment.center,
    children: [
      Icon(icon, size: 18, color: color),
      const SizedBox(height: 7),
      FittedBox(
        fit: BoxFit.scaleDown,
        child: Text(
          label,
          maxLines: 1,
          style: TextStyle(
            fontSize: 11,
            color: color,
            fontWeight: isSelected ? FontWeight.w700 : FontWeight.w400,
          ),
        ),
      ),
    ],
  );
}
