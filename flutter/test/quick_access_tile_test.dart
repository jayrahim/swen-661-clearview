import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:clearview_flutter/models/quick_access_item.dart';
import 'package:clearview_flutter/theme/app_colors.dart';
import 'package:clearview_flutter/theme/app_theme.dart';
import 'package:clearview_flutter/widgets/quick_access_tile.dart';

void main() {
  testWidgets('Quick Access subtitle uses the high-contrast primary token', (
    tester,
  ) async {
    const item = QuickAccessItem(
      kind: QuickAccessKind.prescriptions,
      title: 'Prescriptions',
      subtitle: '4 active',
      backgroundColor: AppColors.yellowTile,
      subtitleColor: AppColors.warningInk,
    );

    await tester.pumpWidget(
      MaterialApp(
        theme: AppTheme.lightTheme(highContrast: true),
        home: const Scaffold(body: QuickAccessTile(item: item)),
      ),
    );

    final subtitle = tester.widget<Text>(find.text('4 active'));
    expect(subtitle.style?.color, AppColors.highContrastPrimary);
  });
}
