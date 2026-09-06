import 'package:flutter/material.dart';

import '../theme/app_colors.dart';
import '../models/message.dart';
import '../widgets/ui_components.dart';

class MessageDetailScreen extends StatelessWidget {
  const MessageDetailScreen({
    super.key,
    required this.message,
  });

  final Message message;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: AppPage(
        child: SafeArea(
          child: SingleChildScrollView(
            padding: const EdgeInsets.fromLTRB(18, 12, 18, 24),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                _Header(
                  onBack: () => Navigator.of(context).pop(),
                ),
                const SizedBox(height: 20),

                Text(
                  message.sender,
                  style: Theme.of(context).textTheme.titleMedium?.copyWith(
                        fontWeight: FontWeight.w700,
                      ),
                ),
                const SizedBox(height: 5),

                Text(
                  _formatSentAt(message.sentAt),
                  style: Theme.of(context).textTheme.bodySmall,
                ),

                const SizedBox(height: 14),
                const Divider(),
                const SizedBox(height: 14),

                Text(
                  message.subject,
                  style: Theme.of(context).textTheme.titleLarge?.copyWith(
                        fontWeight: FontWeight.w700,
                      ),
                ),

                const SizedBox(height: 14),

                Semantics(
                  label: 'Message from ${message.sender}',
                  child: Text(
                    message.body ?? message.preview,
                    style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                          height: 1.5,
                        ),
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

PrimaryButton(
  label: 'View lab results',
  onPressed: () => _showPrototypeMessage(
    context,
    'Lab results are not available in this prototype.',
  ),
),

const SizedBox(height: 8),

SizedBox(
  width: double.infinity,
  height: 53,
  child: OutlinedButton(
    onPressed: () => _showPrototypeMessage(
      context,
      'Reply is not available in this prototype.',
    ),
    style: OutlinedButton.styleFrom(
      foregroundColor: AppColors.primary,
      side: const BorderSide(
        color: AppColors.primary,
        width: 2,
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
        ),
      ),
    );
  }
  void _showPrototypeMessage(BuildContext context, String message) {
  ScaffoldMessenger.of(context).showSnackBar(
    SnackBar(
      content: Text(message),
    ),
  );
}
}

class _Header extends StatelessWidget {
  const _Header({
    required this.onBack,
  });

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
            style: Theme.of(context).textTheme.titleLarge?.copyWith(
                  fontWeight: FontWeight.w700,
                ),
          ),
        ),
        const CircleAvatar(
          child: Text('A'),
        ),
      ],
    );
  }
}

class _StatusCard extends StatelessWidget {
  const _StatusCard({
    required this.title,
    this.detail,
  });

  final String title;
  final String? detail;

  @override
  Widget build(BuildContext context) {
    return Semantics(
      label: '$title${detail != null ? '. $detail' : ''}',
      child: Container(
        width: double.infinity,
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: const Color(0xFFEAF7EF),
          border: Border.all(
            color: const Color(0xFFB7DDC5),
          ),
          borderRadius: BorderRadius.circular(12),
        ),
        child: ExcludeSemantics(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                title,
                style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                      fontWeight: FontWeight.w600,
                      color: const Color(0xFF176B42),
                    ),
              ),
              if (detail != null) ...[
                const SizedBox(height: 8),
                Text(
                  detail!,
                  style: Theme.of(context).textTheme.bodySmall,
                ),
              ],
            ],
          ),
        ),
      ),
    );
  }
}

String _formatSentAt(DateTime dateTime) {
  final hour = dateTime.hour % 12 == 0 ? 12 : dateTime.hour % 12;
  final minute = dateTime.minute.toString().padLeft(2, '0');
  final period = dateTime.hour >= 12 ? 'PM' : 'AM';

  return 'Today • $hour:$minute $period';
}