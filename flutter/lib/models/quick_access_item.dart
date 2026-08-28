import 'package:flutter/material.dart';

class QuickAccessItem {
  const QuickAccessItem({
    required this.title,
    required this.subtitle,
    required this.backgroundColor,
    required this.subtitleColor,
  });

  final String title;
  final String subtitle;
  final Color backgroundColor;
  final Color subtitleColor;
}
