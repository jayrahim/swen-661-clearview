import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../models/message.dart';
import '../repositories/mock_repositories.dart';
import '../theme/app_colors.dart';
import '../widgets/ui_components.dart';
import 'accessibility_settings_screen.dart';
import 'appointments_screen.dart';
import 'message_detail_screen.dart';

class MessagesScreen extends ConsumerWidget {
  const MessagesScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final repository = ref.watch(messageRepositoryProvider);
    final messages = repository.getAll();

    final unreadCount =
        messages.where((message) => !message.isRead).length;

    void openAppointments() {
      Navigator.of(context).push(
        MaterialPageRoute(
          builder: (_) => const AppointmentsScreen(),
        ),
      );
    }

    void openSettings() {
      Navigator.of(context).push(
        MaterialPageRoute(
          builder: (_) => const AccessibilitySettingsScreen(),
        ),
      );
    }

    return Scaffold(
      body: AppPage(
        child: Column(
          children: [
            Expanded(
              child: SafeArea(
                bottom: false,
                child: ListView(
                  padding: const EdgeInsets.all(24),
                  children: [
                    _MessagesHeader(
                      unreadCount: unreadCount,
                    ),
                    const SizedBox(height: 24),
                    ...messages.map(
                      (message) => Padding(
                        padding: const EdgeInsets.only(bottom: 16),
                        child: _MessageCard(
                          message: message,
                          onTap: () {
                            Navigator.of(context).push(
                              MaterialPageRoute(
                                builder: (_) => MessageDetailScreen(
                                  message: message,
                                ),
                              ),
                            );
                          },
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),
            ClearViewBottomNavigation(
              selectedItem: ClearViewNavigationItem.messages,
              onHomeTap: () =>
                  Navigator.of(context).popUntil(
                (route) => route.isFirst,
              ),
              onVisitsTap: openAppointments,
              onSettingsTap: openSettings,
            ),
          ],
        ),
      ),
    );
  }
}

class _MessagesHeader extends StatelessWidget {
  const _MessagesHeader({
    required this.unreadCount,
  });

  final int unreadCount;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

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
                child: Text(
                  'A',
                  style: TextStyle(
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
            ),
          ],
        ),
        const SizedBox(height: 16),
        Semantics(
          label: '$unreadCount unread messages',
          child: Container(
            padding: const EdgeInsets.symmetric(
              horizontal: 14,
              vertical: 8,
            ),
            decoration: BoxDecoration(
              color: AppColors.unreadBadgeBackground,
              borderRadius: BorderRadius.circular(20),
            ),
            child: Text(
              '$unreadCount unread',
              style: theme.textTheme.labelLarge?.copyWith(
                fontWeight: FontWeight.w600,
                color: AppColors.unreadBadgeText,
              ),
            ),
          ),
        ),
      ],
    );
  }
}

class _MessageCard extends StatelessWidget {
  const _MessageCard({
    required this.message,
    required this.onTap,
  });

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
          '${_formatSentAt(message.sentAt)}',
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
                    margin: const EdgeInsets.only(
                      top: 7,
                      right: 12,
                    ),
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
                      _formatSentAt(message.sentAt),
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

String _formatSentAt(DateTime sentAt) {
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];

  if (sentAt.day == 27 && sentAt.month == 8) {
    return 'Today • ${_formatTime(sentAt)}';
  }

  if (sentAt.day == 26 && sentAt.month == 8) {
    return 'Yesterday • ${_formatTime(sentAt)}';
  }

  return '${months[sentAt.month - 1]} '
      '${sentAt.day} • ${_formatTime(sentAt)}';
}

String _formatTime(DateTime dateTime) {
  final hour = dateTime.hour == 0
      ? 12
      : dateTime.hour > 12
          ? dateTime.hour - 12
          : dateTime.hour;

  final minute =
      dateTime.minute.toString().padLeft(2, '0');
  final period = dateTime.hour >= 12 ? 'PM' : 'AM';

  return '$hour:$minute $period';
}