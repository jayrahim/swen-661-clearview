import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../models/message.dart';
import '../repositories/mock_repositories.dart';
import '../theme/clearview_tokens.dart';
import '../utils/message_date_format.dart';
import '../widgets/ui_components.dart';
import 'accessibility_settings_screen.dart';
import 'appointments_screen.dart';
import 'message_detail_screen.dart';
import 'medical_notes_screen.dart';

class MessagesScreen extends ConsumerWidget {
  const MessagesScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final repository = ref.watch(messageRepositoryProvider);
    final messages = repository.getAll();

    final unreadCount = messages.where((message) => !message.isRead).length;

    void openAppointmentsFromNavigation() =>
        Navigator.of(context).pushAndRemoveUntil(
          MaterialPageRoute(builder: (_) => const AppointmentsScreen()),
          (route) => route.isFirst,
        );

    void openSettings() => Navigator.of(context).push(
      MaterialPageRoute(
        builder: (_) => AccessibilitySettingsScreen(
          onVisitsTap: openAppointmentsFromNavigation,
          onMessagesTap: () => Navigator.of(context).pop(),
        ),
      ),
    );
    void openMedicalNotes() => Navigator.of(context)
        .push(MaterialPageRoute(builder: (_) => const MedicalNotesScreen()));

    return ClearViewResponsiveScaffold(
      selectedItem: ClearViewNavigationItem.messages,
      onHomeTap: () => Navigator.of(context).popUntil((route) => route.isFirst),
      onVisitsTap: openAppointmentsFromNavigation,
      onSettingsTap: openSettings,
      onRecordsTap: openMedicalNotes,
      contentWidth: ClearViewContentWidth.reading,
      child: ListView(
        padding: const EdgeInsets.all(24),
        children: [
          _MessagesHeader(unreadCount: unreadCount),
          const SizedBox(height: 24),
          ...messages.map(
            (message) => Padding(
              padding: const EdgeInsets.only(bottom: 16),
              child: _MessageCard(
                message: message,
                onTap: () {
                  Navigator.of(context).push(
                    MaterialPageRoute(
                      builder: (_) => MessageDetailScreen(message: message),
                    ),
                  );
                },
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _MessagesHeader extends StatelessWidget {
  const _MessagesHeader({required this.unreadCount});

  final int unreadCount;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final tokens = context.clearViewTokens;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          children: [
            Expanded(
              child: Text(
                'Messages',
                style: theme.textTheme.headlineMedium?.copyWith(
                  fontWeight: FontWeight.bold,
                ),
              ),
            ),
            Semantics(
              label: 'User profile',
              child: const CircleAvatar(
                radius: 22,
                child: Text('A', style: TextStyle(fontWeight: FontWeight.bold)),
              ),
            ),
          ],
        ),
        const SizedBox(height: 16),
        Semantics(
          label: '$unreadCount unread messages',
          child: Container(
            padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
            decoration: BoxDecoration(
              color: tokens.infoBackground,
              border: Border.all(
                color: tokens.infoBorder,
                width: tokens.borderWidth,
              ),
              borderRadius: BorderRadius.circular(20),
            ),
            child: Text(
              '$unreadCount unread',
              style: theme.textTheme.labelLarge?.copyWith(
                fontWeight: FontWeight.w600,
                color: tokens.ink,
              ),
            ),
          ),
        ),
      ],
    );
  }
}

class _MessageCard extends StatelessWidget {
  const _MessageCard({required this.message, required this.onTap});

  final Message message;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Semantics(
      button: true,
      label:
          '${message.isRead ? "Read" : "Unread"} message from '
          '${message.sender}. ${message.subject}. '
          '${formatMessageDate(message.sentAt)}',
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(16),
        child: AppCard(
          child: Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              if (!message.isRead) ...[
                Semantics(
                  label: 'Unread',
                  child: Container(
                    width: 10,
                    height: 10,
                    margin: const EdgeInsets.only(top: 7, right: 12),
                    decoration: BoxDecoration(
                      color: theme.colorScheme.primary,
                      shape: BoxShape.circle,
                    ),
                  ),
                ),
              ],
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      message.sender,
                      style: theme.textTheme.titleMedium?.copyWith(
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 6),
                    Text(
                      message.subject,
                      style: theme.textTheme.bodyLarge?.copyWith(
                        fontWeight: message.isRead
                            ? FontWeight.normal
                            : FontWeight.w600,
                      ),
                    ),
                    const SizedBox(height: 6),
                    Text(
                      formatMessageDate(message.sentAt),
                      style: theme.textTheme.bodyMedium,
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
