import 'package:flutter/material.dart';

import '../theme/app_colors.dart';
import '../theme/clearview_tokens.dart';

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
