import 'package:flutter/material.dart';

import '../models/message.dart';
import '../navigation/clearview_navigation.dart';
import '../theme/clearview_tokens.dart';
import '../utils/message_date_format.dart';
import '../widgets/ui_components.dart';
import '../widgets/prototype_feedback.dart';

class MessageDetailScreen extends StatelessWidget {
  const MessageDetailScreen({
    super.key,
    required this.message,
    this.onVisitsTap,
    this.onSettingsTap,
    this.onRecordsTap,
  });

  final Message message;
  final VoidCallback? onVisitsTap;
  final VoidCallback? onSettingsTap;
  final VoidCallback? onRecordsTap;

  @override
  Widget build(BuildContext context) {
    final tokens = context.clearViewTokens;
    return ClearViewResponsiveScaffold(
      selectedItem: ClearViewNavigationItem.messages,
      isRootTab: false,
      onHomeTap: () => ClearViewNavigation.returnHome(context),
      onVisitsTap: onVisitsTap,
      onRecordsTap: onRecordsTap,
      onSettingsTap: onSettingsTap,
      contentWidth: ClearViewContentWidth.reading,
      child: SingleChildScrollView(
        padding: const EdgeInsets.fromLTRB(18, 12, 18, 24),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            _Header(onBack: () => Navigator.of(context).pop()),
            const SizedBox(height: 20),

            Text(
              message.sender,
              style: Theme.of(context).textTheme.titleMedium
                  ?.copyWith(fontWeight: FontWeight.w700),
            ),
            const SizedBox(height: 5),

            Text(
              formatMessageDate(message.sentAt),
              style: Theme.of(context).textTheme.bodySmall,
            ),

            const SizedBox(height: 14),
            const Divider(),
            const SizedBox(height: 14),

            Text(
              message.subject,
              style: Theme.of(context).textTheme.titleLarge
                  ?.copyWith(fontWeight: FontWeight.w700),
            ),

            const SizedBox(height: 14),

            Semantics(
              label: 'Message from ${message.sender}',
              child: Text(
                message.body ?? message.preview,
                style: Theme.of(context).textTheme.bodyMedium
                    ?.copyWith(height: 1.5),
              ),
            ),

            if (message.statusMessage != null) ...[
              const SizedBox(height: 36),
              _StatusCard(
                title: message.statusMessage!,
                detail: message.statusDetail,
              ),
            ],

            const SizedBox(height: 24),

            if (message.showLabResultsAction) ...[
              PrimaryButton(
                label: 'View lab results',
                onPressed: () => showPrototypeFeedback(
                  context,
                  'Lab results are not available in this prototype.',
                ),
              ),
            ],
            const SizedBox(height: 8),

            SizedBox(
              width: double.infinity,
              height: 53,
              child: OutlinedButton(
                onPressed: () => showPrototypeFeedback(
                  context,
                  'Reply is not available in this prototype.',
                ),
                style: OutlinedButton.styleFrom(
                  foregroundColor: tokens.primary,
                  side: BorderSide(
                    color: tokens.primary,
                    width: tokens.borderWidth,
                  ),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(11),
                  ),
                ),
                child: const Text('Reply'),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _Header extends StatelessWidget {
  const _Header({required this.onBack});

  final VoidCallback onBack;

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        Semantics(
          button: true,
          label: 'Back to messages',
          child: IconButton(
            tooltip: 'Back to messages',
            onPressed: onBack,
            icon: const Icon(Icons.arrow_back),
          ),
        ),
        const SizedBox(width: 4),
        Expanded(
          child: Text(
            'Message',
            style: Theme.of(context).textTheme.titleLarge
                ?.copyWith(fontWeight: FontWeight.w700),
          ),
        ),
        const CircleAvatar(child: Text('A')),
      ],
    );
  }
}

class _StatusCard extends StatelessWidget {
  const _StatusCard({required this.title, this.detail});

  final String title;
  final String? detail;

  @override
  Widget build(BuildContext context) {
    final tokens = context.clearViewTokens;
    return Semantics(
      label: '$title${detail != null ? '. $detail' : ''}',
      child: Container(
        width: double.infinity,
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: tokens.infoBackground,
          border: Border.all(
            color: tokens.infoBorder,
            width: tokens.borderWidth,
          ),
          borderRadius: BorderRadius.circular(12),
        ),
        child: ExcludeSemantics(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                title,
                style: Theme.of(context).textTheme.bodyMedium
                    ?.copyWith(fontWeight: FontWeight.w600, color: tokens.ink),
              ),
              if (detail != null) ...[
                const SizedBox(height: 8),
                Text(detail!, style: Theme.of(context).textTheme.bodySmall),
              ],
            ],
          ),
        ),
      ),
    );
  }
}
