import 'package:flutter/material.dart';

enum QuickAccessKind { messages, medicalNotes, prescriptions, referrals }

class QuickAccessItem {
  const QuickAccessItem({
    required this.kind,
    required this.title,
    required this.subtitle,
    required this.backgroundColor,
    required this.subtitleColor,
    required this.kind,
  });

  final QuickAccessKind kind;
  final String title;
  final String subtitle;
  final Color backgroundColor;
  final Color subtitleColor;
  final QuickAccessKind kind;
}
