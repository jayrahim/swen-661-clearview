import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:clearview_flutter/screens/appointments_screen.dart';
import 'package:clearview_flutter/screens/dashboard_screen.dart';

Widget buildAppointmentsApp() =>
    ProviderScope(child: MaterialApp(home: const AppointmentsScreen()));

void main() {
  testWidgets('appointments screen renders synthetic upcoming appointments', (
    tester,
  ) async {
    await tester.pumpWidget(buildAppointmentsApp());

    expect(find.text('Appointments'), findsOneWidget);
    expect(find.text('Upcoming'), findsOneWidget);
    expect(find.text('Dr. Elena Martinez'), findsOneWidget);
    expect(find.text('Dr. David Chen'), findsOneWidget);
    expect(find.text('Vision Center'), findsOneWidget);
    expect(find.text('Ophthalmology • North Clinic'), findsOneWidget);
  });

  testWidgets(
    'selected appointment data is displayed in detail and back returns',
    (tester) async {
      await tester.pumpWidget(buildAppointmentsApp());

      await tester.tap(find.text('Dr. David Chen'));
      await tester.pumpAndSettle();

      expect(find.text('Appointment Details'), findsOneWidget);
      expect(find.text('Primary Care visit'), findsOneWidget);
      expect(find.text('Dr. David Chen'), findsOneWidget);
      expect(find.text('Telehealth'), findsOneWidget);
      expect(find.text('Virtual follow-up'), findsOneWidget);
      expect(
        find.text('Join from a quiet place five minutes before your visit.'),
        findsOneWidget,
      );

      await tester.tap(find.byTooltip('Back to appointments'));
      await tester.pumpAndSettle();
      expect(find.text('Upcoming'), findsOneWidget);
    },
  );

  testWidgets('appointments remain usable with larger text', (tester) async {
    tester.view.devicePixelRatio = 1.0;
    tester.view.physicalSize = const Size(393, 852);
    tester.platformDispatcher.textScaleFactorTestValue = 1.5;
    addTearDown(tester.view.resetDevicePixelRatio);
    addTearDown(tester.view.resetPhysicalSize);
    addTearDown(tester.platformDispatcher.clearTextScaleFactorTestValue);
    await tester.pumpWidget(buildAppointmentsApp());

    expect(tester.takeException(), isNull);
    final visionCenter = find.text('Vision Center');
    await tester.ensureVisible(visionCenter);
    await tester.tap(visionCenter);
    await tester.pumpAndSettle();
    expect(find.text('Ophthalmology visit'), findsOneWidget);
    expect(tester.takeException(), isNull);
  });

  testWidgets('Home returns from Appointments to the dashboard', (
    tester,
  ) async {
    await tester.pumpWidget(
      const ProviderScope(child: MaterialApp(home: DashboardScreen())),
    );

    await tester.tap(find.text('Visits'));
    await tester.pumpAndSettle();
    expect(find.text('Appointments'), findsOneWidget);

    await tester.tap(find.text('Home'));
    await tester.pumpAndSettle();
    expect(find.text('Good morning, Maya'), findsOneWidget);
  });
 testWidgets(
  'schedule appointment button shows prototype message',
  (tester) async {
    await tester.pumpWidget(buildAppointmentsApp());

    final scheduleButton = find.text('Schedule Appointment');

    await tester.scrollUntilVisible(
      scheduleButton,
      300,
      scrollable: find.byType(Scrollable).first,
    );
    await tester.pumpAndSettle();

    expect(scheduleButton, findsOneWidget);

    await tester.tap(scheduleButton);
    await tester.pumpAndSettle();

    expect(
      find.text(
        'Scheduling is not available in this prototype.',
      ),
      findsOneWidget,
    );
  },
);
}
