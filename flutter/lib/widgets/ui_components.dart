import 'package:flutter/material.dart';

import '../models/appointment.dart';
import '../models/quick_access_item.dart';
import '../theme/app_colors.dart';
import '../theme/clearview_tokens.dart';

class AppPage extends StatelessWidget {
  const AppPage({super.key, required this.child});
  final Widget child;

  @override
  Widget build(BuildContext context) => SafeArea(
    child: Center(
      child: ConstrainedBox(
        constraints: const BoxConstraints(maxWidth: 480),
        child: child,
      ),
    ),
  );
}

class AppCard extends StatelessWidget {
  const AppCard({
    super.key,
    required this.child,
    this.padding = const EdgeInsets.all(14),
    this.color,
    this.borderColor,
  });
  final Widget child;
  final EdgeInsetsGeometry padding;
  final Color? color;
  final Color? borderColor;

  @override
  Widget build(BuildContext context) {
    final tokens = context.clearViewTokens;
    return Container(
      padding: padding,
      decoration: BoxDecoration(
        color: color ?? tokens.surface,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(
          color: borderColor ?? tokens.border,
          width: tokens.borderWidth,
        ),
      ),
      child: child,
    );
  }
}

class PrimaryButton extends StatelessWidget {
  const PrimaryButton({
    super.key,
    required this.label,
    required this.onPressed,
  });
  final String label;
  final VoidCallback onPressed;

  @override
  Widget build(BuildContext context) => ConstrainedBox(
    constraints: const BoxConstraints(minWidth: double.infinity, minHeight: 53),
    child: FilledButton(
      style: FilledButton.styleFrom(
        backgroundColor: context.clearViewTokens.primary,
        foregroundColor: Colors.white,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(11)),
      ),
      onPressed: onPressed,
      child: Text(label),
    ),
  );
}

class StatusPill extends StatelessWidget {
  const StatusPill({
    super.key,
    required this.label,
    this.backgroundColor = AppColors.aqua,
    this.foregroundColor = AppColors.primary,
    this.borderColor,
  });
  final String label;
  final Color backgroundColor;
  final Color foregroundColor;
  final Color? borderColor;

  @override
  Widget build(BuildContext context) => Container(
    padding: const EdgeInsets.symmetric(horizontal: 17, vertical: 8),
    decoration: BoxDecoration(
      color: backgroundColor,
      borderRadius: BorderRadius.circular(22),
      border: borderColor == null
          ? null
          : Border.all(color: borderColor!, width: 2),
    ),
    child: Text(
      label,
      style: TextStyle(color: foregroundColor, fontWeight: FontWeight.w700),
    ),
  );
}

class AppointmentStatusPill extends StatelessWidget {
  const AppointmentStatusPill({super.key, required this.status});

  final AppointmentStatus status;

  @override
  Widget build(BuildContext context) {
    final style = AppointmentStatusStyle.forStatus(status);
    final tokens = context.clearViewTokens;
    return StatusPill(
      label: status.label,
      backgroundColor: tokens.isHighContrast
          ? tokens.surface
          : style.background,
      foregroundColor: style.foreground,
      borderColor: tokens.isHighContrast ? style.foreground : null,
    );
  }
}

class AppointmentStatusStyle {
  const AppointmentStatusStyle._(this.background, this.foreground);

  final Color background;
  final Color foreground;

  static const _confirmed = AppointmentStatusStyle._(
    AppColors.mint,
    AppColors.mintInk,
  );
  static const _needsAction = AppointmentStatusStyle._(
    AppColors.yellowTile,
    AppColors.warningInk,
  );

  static AppointmentStatusStyle forStatus(AppointmentStatus status) =>
      switch (status) {
        AppointmentStatus.confirmed => _confirmed,
        AppointmentStatus.needsAction => _needsAction,
      };
}

class QuickAccessTile extends StatelessWidget {
  const QuickAccessTile({super.key, required this.item});
  final QuickAccessItem item;

  @override
  Widget build(BuildContext context) {
    final tokens = context.clearViewTokens;
    return Semantics(
      label: '${item.title}, ${item.subtitle}',
      child: ExcludeSemantics(
        child: Container(
          padding: const EdgeInsets.all(14),
          decoration: BoxDecoration(
            color: tokens.isHighContrast
                ? tokens.surface
                : item.backgroundColor,
            borderRadius: BorderRadius.circular(12),
            border: tokens.isHighContrast
                ? Border.all(color: tokens.border, width: tokens.borderWidth)
                : null,
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(item.title, style: Theme.of(context).textTheme.titleMedium),
              Text(
                item.subtitle,
                style: TextStyle(color: item.subtitleColor, fontSize: 14),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class AccessibilityOptionCard extends StatelessWidget {
  const AccessibilityOptionCard({
    super.key,
    required this.title,
    required this.description,
    required this.value,
    this.isEnabled = false,
    this.onTap,
  });
  final String title;
  final String description;
  final String value;
  final bool isEnabled;
  final VoidCallback? onTap;

  @override
  Widget build(BuildContext context) {
    final tokens = context.clearViewTokens;
    final content = ExcludeSemantics(
      child: AppCard(
        padding: const EdgeInsets.fromLTRB(13, 14, 18, 14),
        borderColor: tokens.isHighContrast && isEnabled
            ? AppColors.mintInk
            : null,
        child: LayoutBuilder(
          builder: (context, constraints) {
            final useStackedLayout =
                MediaQuery.textScalerOf(context).scale(1) > 1.3;
            final details = Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(title, style: Theme.of(context).textTheme.titleMedium),
                const SizedBox(height: 8),
                Text(
                  description,
                  style: Theme.of(context).textTheme.bodyMedium
                      ?.copyWith(fontSize: 13),
                ),
              ],
            );
            final valuePill = StatusPill(
              label: value,
              backgroundColor: tokens.isHighContrast
                  ? tokens.surface
                  : isEnabled
                  ? AppColors.mint
                  : AppColors.aqua,
              foregroundColor: isEnabled ? AppColors.mintInk : tokens.primary,
              borderColor: tokens.isHighContrast
                  ? (isEnabled ? AppColors.mintInk : tokens.border)
                  : null,
            );
            if (useStackedLayout) {
              return Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [details, const SizedBox(height: 12), valuePill],
              );
            }
            return Row(
              children: [
                Expanded(child: details),
                const SizedBox(width: 12),
                valuePill,
              ],
            );
          },
        ),
      ),
    );
    return Semantics(
      button: onTap != null,
      label: '$title, $value. $description',
      child: onTap == null
          ? content
          : InkWell(
              onTap: onTap,
              borderRadius: BorderRadius.circular(14),
              child: content,
            ),
    );
  }
}

enum ClearViewNavigationItem { home, visits, messages, records, settings }

class ClearViewBottomNavigation extends StatelessWidget {
  const ClearViewBottomNavigation({
    super.key,
    required this.onSettingsTap,
    this.onHomeTap,
    this.onVisitsTap,
    this.selectedItem = ClearViewNavigationItem.home,
  });
  final VoidCallback onSettingsTap;
  final VoidCallback? onHomeTap;
  final VoidCallback? onVisitsTap;
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
          const _NavItem(icon: Icons.mail_outline, label: 'Messages'),
          const _NavItem(icon: Icons.view_headline_outlined, label: 'Records'),
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
    return Expanded(
      child: Semantics(
        button: true,
        selected: isSelected,
        label: label,
        child: InkWell(
          onTap: onTap,
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(icon, size: 18, color: color),
              const SizedBox(height: 7),
              Text(
                label,
                style: TextStyle(
                  fontSize: 11,
                  color: color,
                  fontWeight: isSelected ? FontWeight.w700 : FontWeight.w400,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
