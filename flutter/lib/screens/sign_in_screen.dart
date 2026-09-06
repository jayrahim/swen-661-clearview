import 'package:flutter/material.dart';

import '../theme/clearview_tokens.dart';
import '../widgets/ui_components.dart';
import 'dashboard_screen.dart';

class SignInScreen extends StatefulWidget {
  const SignInScreen({super.key});
  @override
  State<SignInScreen> createState() => _SignInScreenState();
}

class _SignInScreenState extends State<SignInScreen> {
  bool _obscurePassword = true;

  @override
  Widget build(BuildContext context) {
    final tokens = context.clearViewTokens;
    return Scaffold(
      body: AppPage(
        child: SingleChildScrollView(
          padding: const EdgeInsets.fromLTRB(24, 92, 24, 28),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'CareConnect',
                style: Theme.of(context).textTheme.headlineLarge
                    ?.copyWith(color: tokens.primary, fontSize: 30),
              ),
              const SizedBox(height: 2),
              Text(
                'ClearView',
                style: Theme.of(context).textTheme.titleLarge?.copyWith(
                  color: tokens.isHighContrast
                      ? tokens.ink
                      : const Color(0xFF614185),
                ),
              ),
              const SizedBox(height: 34),
              Text(
                'Sign in to manage your care',
                style: Theme.of(context).textTheme.headlineMedium
                    ?.copyWith(fontSize: 26),
              ),
              const SizedBox(height: 10),
              Text(
                'Use your CareConnect account to view appointments, messages, and health information.',
                style: Theme.of(context).textTheme.bodyMedium
                    ?.copyWith(fontSize: 16),
              ),
              const SizedBox(height: 34),
              const _FieldLabel('Email'),
              const SizedBox(height: 9),
              Semantics(
                label: 'Email address',
                textField: true,
                child: TextField(
                  keyboardType: TextInputType.emailAddress,
                  decoration: InputDecoration(
                    hintText: 'maya.carter@example.com',
                  ),
                ),
              ),
              const SizedBox(height: 22),
              const _FieldLabel('Password'),
              const SizedBox(height: 9),
              Semantics(
                label: 'Password',
                textField: true,
                child: TextField(
                  obscureText: _obscurePassword,
                  decoration: InputDecoration(
                    hintText: '••••••••••••',
                    suffixIcon: Tooltip(
                      message: _obscurePassword
                          ? 'Show password'
                          : 'Hide password',
                      child: TextButton(
                        onPressed: () => setState(
                          () => _obscurePassword = !_obscurePassword,
                        ),
                        child: Text(_obscurePassword ? 'Show' : 'Hide'),
                      ),
                    ),
                  ),
                ),
              ),
              const SizedBox(height: 30),
              PrimaryButton(
                label: 'Sign in',
                onPressed: () => Navigator.of(context).pushReplacement(
                  MaterialPageRoute(builder: (_) => const DashboardScreen()),
                ),
              ),
              const SizedBox(height: 16),
              Center(
                child: TextButton(
                  onPressed: () {},
                  child: const Text('Forgot password?'),
                ),
              ),
              const SizedBox(height: 30),
              Semantics(
                label: 'Accessibility information. Accessibility options are available after sign-in and can be saved for future sessions.',
                child: ExcludeSemantics(
                  child: Container(
                    width: double.infinity,
                    padding: const EdgeInsets.all(13),
                    decoration: BoxDecoration(
                      color: tokens.infoBackground,
                      border: Border.all(
                        color: tokens.infoBorder,
                        width: tokens.borderWidth,
                      ),
                      borderRadius: BorderRadius.circular(11),
                    ),
                    child: Text(
                      'Accessibility options are available after sign-in and can be saved for future sessions.',
                      style: TextStyle(color: tokens.primary, fontSize: 14),
                    ),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _FieldLabel extends StatelessWidget {
  const _FieldLabel(this.label);
  final String label;
  @override
  Widget build(BuildContext context) => Text(
    label,
    style: Theme.of(context).textTheme.labelLarge?.copyWith(fontSize: 14),
  );
}
