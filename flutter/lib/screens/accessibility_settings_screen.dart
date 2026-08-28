import 'package:flutter/material.dart';

import '../theme/app_colors.dart';
import '../widgets/ui_components.dart';

class AccessibilitySettingsScreen extends StatelessWidget {
  const AccessibilitySettingsScreen({super.key});

  @override
  Widget build(BuildContext context) => Scaffold(
    body: AppPage(
      child: Column(
        children: [
          Container(
            padding: const EdgeInsets.fromLTRB(18, 25, 18, 13),
            decoration: const BoxDecoration(
              border: Border(bottom: BorderSide(color: Color(0xFFD9E2EA))),
            ),
            child: Row(
              children: [
                Tooltip(
                  message: 'Back to dashboard',
                  child: IconButton(
                    padding: EdgeInsets.zero,
                    constraints: const BoxConstraints(),
                    icon: const Icon(
                      Icons.arrow_back_ios_new,
                      size: 20,
                      color: AppColors.primary,
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
                  const AccessibilityOptionCard(
                    title: 'Text size',
                    description: 'Adjust text across the app',
                    value: 'Large',
                  ),
                  const SizedBox(height: 18),
                  const AccessibilityOptionCard(
                    title: 'High contrast',
                    description: 'Increase contrast for text and controls',
                    value: 'On',
                    isEnabled: true,
                  ),
                  const SizedBox(height: 18),
                  const AccessibilityOptionCard(
                    title: 'Reduced clutter',
                    description: 'Show fewer secondary items',
                    value: 'Off',
                  ),
                  const SizedBox(height: 18),
                  const AccessibilityOptionCard(
                    title: 'Color preference',
                    description: 'Use a calmer accent palette',
                    value: 'Cool',
                  ),
                  const SizedBox(height: 31),
                  Semantics(
                    label: 'Live preview. Appointments and messages remain readable at your selected size.',
                    child: ExcludeSemantics(
                      child: Container(
                        width: double.infinity,
                        padding: const EdgeInsets.all(14),
                        decoration: BoxDecoration(
                          color: AppColors.aqua,
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            const Text(
                              'Live preview',
                              style: TextStyle(
                                color: AppColors.primary,
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
                          foregroundColor: AppColors.primary,
                          side: const BorderSide(
                            color: AppColors.primary,
                            width: 2,
                          ),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(11),
                          ),
                        ),
                        onPressed: () {},
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
