import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../state/accessibility_preferences.dart';
import '../theme/clearview_tokens.dart';
import '../widgets/ui_components.dart';

class AccessibilitySettingsScreen extends ConsumerWidget {
  const AccessibilitySettingsScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final preferences = ref.watch(accessibilityPreferencesProvider);
    final controller = ref.read(accessibilityPreferencesProvider.notifier);
    final tokens = context.clearViewTokens;
    return Scaffold(
      body: AppPage(
        child: Column(
          children: [
            Container(
              padding: const EdgeInsets.fromLTRB(18, 25, 18, 13),
              decoration: BoxDecoration(
                border: Border(
                  bottom: BorderSide(
                    color: tokens.border,
                    width: tokens.borderWidth,
                  ),
                ),
              ),
              child: Row(
                children: [
                  Tooltip(
                    message: 'Back to dashboard',
                    child: IconButton(
                      padding: EdgeInsets.zero,
                      constraints: const BoxConstraints(
                        minWidth: 48,
                        minHeight: 48,
                      ),
                      tooltip: 'Back to dashboard',
                      icon: Icon(
                        Icons.arrow_back_ios_new,
                        size: 20,
                        color: tokens.primary,
                      ),
                      onPressed: () => Navigator.of(context).pop(),
                    ),
                  ),
                  const SizedBox(width: 26),
                  Text(
                    'Accessibility',
                    style: Theme.of(context).textTheme.headlineMedium
                        ?.copyWith(fontSize: 24),
                  ),
                ],
              ),
            ),
            Expanded(
              child: SingleChildScrollView(
                padding: const EdgeInsets.fromLTRB(18, 17, 18, 28),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Make CareConnect easier to see and use.',
                      style: Theme.of(context).textTheme.bodyMedium
                          ?.copyWith(fontSize: 16),
                    ),
                    const SizedBox(height: 36),
                    AccessibilityOptionCard(
                      title: 'Text size',
                      description: 'Adjust text across the app',
                      value: preferences.textSize.label,
                      onTap: controller.cycleTextSize,
                    ),
                    const SizedBox(height: 18),
                    AccessibilityOptionCard(
                      title: 'High contrast',
                      description: 'Increase contrast for text and controls',
                      value: preferences.highContrast ? 'On' : 'Off',
                      isEnabled: preferences.highContrast,
                      onTap: controller.toggleHighContrast,
                    ),
                    const SizedBox(height: 18),
                    AccessibilityOptionCard(
                      title: 'Reduced clutter',
                      description: 'Show fewer secondary items',
                      value: preferences.reducedClutter ? 'On' : 'Off',
                      onTap: controller.toggleReducedClutter,
                    ),
                    const SizedBox(height: 18),
                    AccessibilityOptionCard(
                      title: 'Color preference',
                      description: 'Use a calmer accent palette',
                      value: preferences.colorPreference,
                    ),
                    const SizedBox(height: 31),
                    Semantics(
                      label: 'Live preview. Appointments and messages remain readable at your selected size.',
                      child: ExcludeSemantics(
                        child: Container(
                          width: double.infinity,
                          padding: const EdgeInsets.all(14),
                          decoration: BoxDecoration(
                            color: tokens.infoBackground,
                            border: Border.all(
                              color: tokens.infoBorder,
                              width: tokens.borderWidth,
                            ),
                            borderRadius: BorderRadius.circular(12),
                          ),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                'Live preview',
                                style: TextStyle(
                                  color: tokens.primary,
                                  fontWeight: FontWeight.w700,
                                ),
                              ),
                              const SizedBox(height: 6),
                              Text(
                                'Appointments and messages remain readable at your selected size.',
                                style: Theme.of(context).textTheme.bodyLarge,
                              ),
                            ],
                          ),
                        ),
                      ),
                    ),
                    const SizedBox(height: 18),
                    Semantics(
                      button: true,
                      label: 'Reset accessibility preferences',
                      child: ConstrainedBox(
                        constraints: const BoxConstraints(
                          minWidth: double.infinity,
                          minHeight: 52,
                        ),
                        child: OutlinedButton(
                          style: OutlinedButton.styleFrom(
                            foregroundColor: tokens.primary,
                            side: BorderSide(color: tokens.primary, width: 2),
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(11),
                            ),
                          ),
                          onPressed: controller.reset,
                          child: const Text('Reset preferences'),
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
