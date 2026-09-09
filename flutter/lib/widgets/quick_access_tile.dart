import 'package:flutter/material.dart';

import '../models/quick_access_item.dart';
import '../theme/clearview_tokens.dart';

class QuickAccessTile extends StatelessWidget {
  const QuickAccessTile({super.key, required this.item, this.onTap});

  final QuickAccessItem item;
  final VoidCallback? onTap;

  @override
  Widget build(BuildContext context) {
    final tokens = context.clearViewTokens;
    final content = Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: tokens.isHighContrast ? tokens.surface : item.backgroundColor,
        borderRadius: BorderRadius.circular(12),
        border: tokens.isHighContrast
            ? Border.all(color: tokens.border, width: tokens.borderWidth)
            : null,
      ),
      // The responsive grid allows this content to wrap at the user's
      // chosen text scale instead of shrinking the text.
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisSize: MainAxisSize.min,
        children: [
          Text(item.title, style: Theme.of(context).textTheme.titleMedium),
          const SizedBox(height: 6),
          Text(
            item.subtitle,
            style: TextStyle(color: item.subtitleColor, fontSize: 14),
          ),
        ],
      ),
    );
    return Semantics(
      button: onTap != null,
      label: '${item.title}, ${item.subtitle}',
      child: onTap == null
          ? ExcludeSemantics(child: content)
          : InkWell(
              onTap: onTap,
              borderRadius: BorderRadius.circular(12),
              child: ExcludeSemantics(child: content),
            ),
    );
  }
}
