import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:clearview_flutter/screens/accessibility_settings_screen.dart';

void main() {
  testWidgets('Color preference provides prototype feedback', (tester) async {
    tester.view.devicePixelRatio = 1;
    tester.view.physicalSize = const Size(1024, 768);
    addTearDown(tester.view.resetDevicePixelRatio);
    addTearDown(tester.view.resetPhysicalSize);

    await tester.pumpWidget(
      const ProviderScope(
        child: MaterialApp(home: AccessibilitySettingsScreen()),
      ),
    );

    await tester.tap(find.text('Color preference'));
    await tester.pump();

    expect(
      find.text('Color preference is not available in this prototype.'),
      findsOneWidget,
    );
  });
}
