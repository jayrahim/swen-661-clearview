import 'package:flutter/material.dart';

import '../theme/app_colors.dart';
import '../theme/clearview_tokens.dart';
import 'surfaces.dart';

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
