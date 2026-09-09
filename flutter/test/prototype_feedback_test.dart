import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:clearview_flutter/widgets/prototype_feedback.dart';
import 'package:clearview_flutter/widgets/ui_components.dart';

void main() {
  testWidgets('prototype feedback floats above tablet navigation', (
    tester,
  ) async {
    tester.view.devicePixelRatio = 1;
    tester.view.physicalSize = const Size(1024, 768);
    addTearDown(tester.view.resetDevicePixelRatio);
    addTearDown(tester.view.resetPhysicalSize);

    await tester.pumpWidget(
      MaterialApp(
        home: ClearViewResponsiveScaffold(
          child: Center(
            child: Builder(
              builder: (context) => TextButton(
                onPressed: () => showPrototypeFeedback(
                  context,
                  'This action is not available in this prototype.',
                ),
                child: const Text('Prototype action'),
              ),
            ),
          ),
        ),
      ),
    );

    await tester.tap(find.text('Prototype action'));
    await tester.pump();

    final snackBar = tester.widget<SnackBar>(find.byType(SnackBar));
    expect(snackBar.behavior, SnackBarBehavior.floating);
    expect(
      find.text('This action is not available in this prototype.'),
      findsOneWidget,
    );
  });
}
