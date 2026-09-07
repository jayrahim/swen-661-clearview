String formatMessageDate(DateTime sentAt, {DateTime? now}) {
  final reference = now ?? DateTime.now();

  final sentDate = DateTime(sentAt.year, sentAt.month, sentAt.day);
  final today = DateTime(reference.year, reference.month, reference.day);
  final yesterday = today.subtract(const Duration(days: 1));

  if (sentDate == today) {
    return 'Today • ${_formatTime(sentAt)}';
  }

  if (sentDate == yesterday) {
    return 'Yesterday • ${_formatTime(sentAt)}';
  }

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

  return '${months[sentAt.month - 1]} ${sentAt.day} • ${_formatTime(sentAt)}';
}

String _formatTime(DateTime dateTime) {
  final hour = dateTime.hour == 0
      ? 12
      : dateTime.hour > 12
      ? dateTime.hour - 12
      : dateTime.hour;

  final minute = dateTime.minute.toString().padLeft(2, '0');
  final period = dateTime.hour >= 12 ? 'PM' : 'AM';

  return '$hour:$minute $period';
}
