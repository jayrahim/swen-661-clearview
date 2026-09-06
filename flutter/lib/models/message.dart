class Message {
  const Message({
    required this.id,
    required this.sender,
    required this.subject,
    required this.preview,
    required this.sentAt,
    this.isRead = false,
    this.body,
    this.statusMessage,
    this.statusDetail,
  });

  final String id;
  final String sender;
  final String subject;
  final String preview;
  final DateTime sentAt;
  final bool isRead;

  final String? body;
  final String? statusMessage;
  final String? statusDetail;
}
