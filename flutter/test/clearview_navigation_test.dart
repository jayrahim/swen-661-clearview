import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:clearview_flutter/navigation/clearview_navigation.dart';

void main() {
  testWidgets('opening a root tab removes transient routes but keeps home', (
    tester,
  ) async {
    await tester.pumpWidget(const MaterialApp(home: _HomeScreen()));

    await tester.tap(find.text('Open detail'));
    await tester.pumpAndSettle();
    expect(find.text('Detail'), findsOneWidget);

    await tester.tap(find.text('Open appointments root tab'));
    await tester.pumpAndSettle();
    expect(find.text('Appointments'), findsOneWidget);

    await tester.tap(find.text('Return home'));
    await tester.pumpAndSettle();
    expect(find.text('Open detail'), findsOneWidget);
  });

  testWidgets('replace removes the current route from the stack', (
    tester,
  ) async {
    await tester.pumpWidget(const MaterialApp(home: _SignInScreen()));

    await tester.tap(find.text('Sign in'));
    await tester.pumpAndSettle();
    expect(find.text('Dashboard'), findsOneWidget);

    await tester.binding.handlePopRoute();
    await tester.pumpAndSettle();
    expect(find.text('Sign in'), findsNothing);
  });
}

class _HomeScreen extends StatelessWidget {
  const _HomeScreen();

  @override
  Widget build(BuildContext context) => Scaffold(
    body: Center(
      child: TextButton(
        onPressed: () =>
            ClearViewNavigation.push(context, const _DetailScreen()),
        child: const Text('Open detail'),
      ),
    ),
  );
}

class _DetailScreen extends StatelessWidget {
  const _DetailScreen();

  @override
  Widget build(BuildContext context) => Scaffold(
    body: Column(
      children: [
        const Text('Detail'),
        TextButton(
          onPressed: () => ClearViewNavigation.openRootTab(
            context,
            const _AppointmentsScreen(),
          ),
          child: const Text('Open appointments root tab'),
        ),
      ],
    ),
  );
}

class _AppointmentsScreen extends StatelessWidget {
  const _AppointmentsScreen();

  @override
  Widget build(BuildContext context) => Scaffold(
    body: Column(
      children: [
        const Text('Appointments'),
        TextButton(
          onPressed: () => ClearViewNavigation.returnHome(context),
          child: const Text('Return home'),
        ),
      ],
    ),
  );
}

class _SignInScreen extends StatelessWidget {
  const _SignInScreen();

  @override
  Widget build(BuildContext context) => Scaffold(
    body: Center(
      child: TextButton(
        onPressed: () =>
            ClearViewNavigation.replace(context, const _DashboardScreen()),
        child: const Text('Sign in'),
      ),
    ),
  );
}

class _DashboardScreen extends StatelessWidget {
  const _DashboardScreen();

  @override
  Widget build(BuildContext context) =>
      const Scaffold(body: Center(child: Text('Dashboard')));
}
