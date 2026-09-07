import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../models/quick_access_item.dart';
import '../models/appointment.dart';
import '../repositories/mock_repositories.dart';
import '../state/accessibility_preferences.dart';
import '../theme/app_colors.dart';
import '../theme/clearview_tokens.dart';
import '../widgets/ui_components.dart';
import 'accessibility_settings_screen.dart';
import 'appointment_detail_screen.dart';
import 'appointments_screen.dart';
import 'messages_screen.dart';

class DashboardScreen extends ConsumerWidget {
  const DashboardScreen({super.key});

  static const _items = [
    QuickAccessItem(
      title: 'Messages',
      subtitle: '2 unread',
      backgroundColor: AppColors.blueTile,
      subtitleColor: Color(0xFF00679D),
    ),
    QuickAccessItem(
      title: 'Medical notes',
      subtitle: '3 recent',
      backgroundColor: AppColors.aqua,
      subtitleColor: AppColors.primary,
    ),
    QuickAccessItem(
      title: 'Prescriptions',
      subtitle: '4 active',
      backgroundColor: AppColors.yellowTile,
      subtitleColor: Color(0xFF9B5800),
    ),
    QuickAccessItem(
      title: 'Referrals',
      subtitle: '1 pending',
      backgroundColor: AppColors.purpleTile,
      subtitleColor: Color(0xFF67477D),
    ),
  ];

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final preferences = ref.watch(accessibilityPreferencesProvider);
    final tokens = context.clearViewTokens;
    final appointment = ref.watch(appointmentRepositoryProvider).getAll().first;
    void openAccessibility() => Navigator.of(context).push(
      MaterialPageRoute(builder: (_) => const AccessibilitySettingsScreen()),
    );
    void openAppointments() => Navigator.of(context)
        .push(MaterialPageRoute(builder: (_) => const AppointmentsScreen()));
    void openMessages() {
      Navigator.of(context)
          .push(MaterialPageRoute(builder: (_) => const MessagesScreen()));
    }

    return Scaffold(
      body: AppPage(
        child: Column(
          children: [
            Expanded(
              child: SingleChildScrollView(
                padding: const EdgeInsets.fromLTRB(18, 28, 18, 28),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    LayoutBuilder(
                      builder: (context, constraints) {
                        final useStackedHeader =
                            MediaQuery.textScalerOf(context).scale(1) > 1.25;
                        final greeting = Text(
                          'Good morning, Maya',
                          style: Theme.of(context).textTheme.headlineMedium
                              ?.copyWith(fontSize: 23),
                        );
                        final accessibilityLabel = Text(
                          'Accessibility',
                          style: TextStyle(
                            color: tokens.primary,
                            fontWeight: FontWeight.w700,
                          ),
                        );
                        return useStackedHeader
                            ? Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  greeting,
                                  const SizedBox(height: 8),
                                  accessibilityLabel,
                                ],
                              )
                            : Row(
                                mainAxisAlignment:
                                    MainAxisAlignment.spaceBetween,
                                children: [
                                  Expanded(child: greeting),
                                  const SizedBox(width: 12),
                                  accessibilityLabel,
                                ],
                              );
                      },
                    ),
                    const SizedBox(height: 29),

                    if (preferences.reducedClutter) ...[
                      _ReducedClutterDashboardContent(
                        appointment: appointment,
                        onAccessibilityTap: openAccessibility,
                      ),
                    ] else ...[
                      Text(
                        'Thursday, August 27',
                        style: Theme.of(context).textTheme.bodyMedium,
                      ),
                      const SizedBox(height: 21),
                      AppCard(
                        padding: const EdgeInsets.fromLTRB(16, 14, 16, 13),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Builder(
                              builder: (context) {
                                final appointmentLabel = Text(
                                  'Next appointment',
                                  style: TextStyle(
                                    color: tokens.primary,
                                    fontWeight: FontWeight.w700,
                                  ),
                                );
                                final confirmedPill = AppointmentStatusPill(
                                  status: appointment.status,
                                );
                                if (MediaQuery.textScalerOf(context).scale(1) >
                                    1.1) {
                                  return Column(
                                    crossAxisAlignment:
                                        CrossAxisAlignment.start,
                                    children: [
                                      appointmentLabel,
                                      const SizedBox(height: 8),
                                      confirmedPill,
                                    ],
                                  );
                                }
                                return Row(
                                  mainAxisAlignment:
                                      MainAxisAlignment.spaceBetween,
                                  crossAxisAlignment: CrossAxisAlignment.center,
                                  children: [
                                    Flexible(child: appointmentLabel),
                                    const SizedBox(width: 12),
                                    confirmedPill,
                                  ],
                                );
                              },
                            ),
                            const SizedBox(height: 5),
                            Text(
                              appointment.clinicianName,
                              style: Theme.of(context).textTheme.titleLarge,
                            ),
                            const SizedBox(height: 8),
                            Text(
                              'Sep 4 • 10:30 AM',
                              style: Theme.of(context).textTheme.titleMedium,
                            ),
                            const SizedBox(height: 8),
                            Text(
                              '${appointment.specialty} • ${appointment.location}',
                              style: Theme.of(context).textTheme.bodyMedium,
                            ),
                            const SizedBox(height: 9),
                            Semantics(
                              button: true,
                              label: 'View appointment details',
                              child: TextButton(
                                onPressed: () => Navigator.of(context).push(
                                  MaterialPageRoute(
                                    builder: (_) => AppointmentDetailScreen(
                                      appointment: appointment,
                                    ),
                                  ),
                                ),
                                child: const Text('View details  →'),
                              ),
                            ),
                          ],
                        ),
                      ),
                      const SizedBox(height: 25),
                      Text(
                        'Quick access',
                        style: Theme.of(context).textTheme.titleLarge
                            ?.copyWith(fontSize: 21),
                      ),
                      const SizedBox(height: 17),
                      GridView.builder(
                        shrinkWrap: true,
                        physics: const NeverScrollableScrollPhysics(),
                        itemCount: _items.length,
                        gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
                          crossAxisCount: 2,
                          crossAxisSpacing: 13,
                          mainAxisSpacing: 20,
                          childAspectRatio:
                              1.58 /
                              MediaQuery.textScalerOf(context)
                                  .scale(1)
                                  .clamp(1, 2),
                        ),
                        itemBuilder: (_, index) {
                          final item = _items[index];

                          return QuickAccessTile(
                            item: item,
                            onTap: item.title == 'Messages'
                                ? openMessages
                                : null,
                          );
                        },
                      ),
                      const SizedBox(height: 42),
                      Semantics(
                        button: true,
                        label:
                            'Accessibility preferences. Text ${preferences.textSize.label}. High contrast ${preferences.highContrast ? 'on' : 'off'}.',
                        child: InkWell(
                          onTap: openAccessibility,
                          borderRadius: BorderRadius.circular(14),
                          child: AppCard(
                            child: LayoutBuilder(
                              builder: (context, constraints) {
                                final useStackedLayout =
                                    MediaQuery.textScalerOf(context).scale(1) >
                                    1.3;

                                final details = Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Text(
                                      'Accessibility preferences',
                                      style: Theme.of(context)
                                          .textTheme
                                          .titleMedium,
                                    ),
                                    const SizedBox(height: 9),
                                    Text(
                                      'Text: ${preferences.textSize.label} • High contrast: ${preferences.highContrast ? 'On' : 'Off'}',
                                      style: Theme.of(context)
                                          .textTheme
                                          .bodyMedium
                                          ?.copyWith(fontSize: 14),
                                    ),
                                  ],
                                );

                                return useStackedLayout
                                    ? Column(
                                        crossAxisAlignment:
                                            CrossAxisAlignment.start,
                                        children: [
                                          details,
                                          const SizedBox(height: 8),
                                          Icon(
                                            Icons.chevron_right,
                                            color: tokens.primary,
                                            size: 30,
                                          ),
                                        ],
                                      )
                                    : Row(
                                        children: [
                                          Expanded(child: details),
                                          Icon(
                                            Icons.chevron_right,
                                            color: tokens.primary,
                                            size: 30,
                                          ),
                                        ],
                                      );
                              },
                            ),
                          ),
                        ),
                      ),
                    ],
                  ],
                ),
              ),
            ),
            ClearViewBottomNavigation(
              onSettingsTap: openAccessibility,
              onVisitsTap: openAppointments,
              onMessagesTap: openMessages,
            ),
          ],
        ),
      ),
    );
  }
}

class _ReducedClutterDashboardContent extends StatelessWidget {
  const _ReducedClutterDashboardContent({
    required this.appointment,
    required this.onAccessibilityTap,
  });

  final Appointment appointment;
  final VoidCallback onAccessibilityTap;

  @override
  Widget build(BuildContext context) {
    final tokens = context.clearViewTokens;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        StatusPill(
          label: 'Reduced clutter',
          backgroundColor: tokens.surface,
          foregroundColor: tokens.primary,
          borderColor: tokens.border,
        ),
        const SizedBox(height: 28),

        Text('Next appointment', style: Theme.of(context).textTheme.titleLarge),
        const SizedBox(height: 16),

        AppCard(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                appointment.clinicianName,
                style: Theme.of(context).textTheme.titleLarge,
              ),
              const SizedBox(height: 8),
              Text(
                'Sep 4 • 10:30 AM',
                style: Theme.of(context).textTheme.titleMedium,
              ),
              const SizedBox(height: 8),
              Text(
                appointment.location,
                style: Theme.of(context).textTheme.bodyMedium,
              ),
              const SizedBox(height: 16),
              PrimaryButton(
                label: 'View appointment',
                onPressed: () => Navigator.of(context).push(
                  MaterialPageRoute(
                    builder: (_) =>
                        AppointmentDetailScreen(appointment: appointment),
                  ),
                ),
              ),
            ],
          ),
        ),

        const SizedBox(height: 28),

        Text(
          'Essential actions',
          style: Theme.of(context).textTheme.titleLarge,
        ),
        const SizedBox(height: 16),

        const _EssentialActionCard(title: 'Messages', subtitle: '2 unread'),
        const SizedBox(height: 12),

        const _EssentialActionCard(
          title: 'Medical notes',
          subtitle: '3 recent',
        ),
        const SizedBox(height: 12),

        _EssentialActionCard(
          title: 'Accessibility',
          subtitle: 'Large text • High contrast',
          onTap: onAccessibilityTap,
        ),
      ],
    );
  }
}

class _EssentialActionCard extends StatelessWidget {
  const _EssentialActionCard({
    required this.title,
    required this.subtitle,
    this.onTap,
  });

  final String title;
  final String subtitle;
  final VoidCallback? onTap;

  @override
  Widget build(BuildContext context) {
    final tokens = context.clearViewTokens;
    final isInteractive = onTap != null;

    final card = AppCard(
      child: ConstrainedBox(
        constraints: const BoxConstraints(minHeight: 48),
        child: Row(
          children: [
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Text(title, style: Theme.of(context).textTheme.titleMedium),
                  const SizedBox(height: 5),
                  Text(subtitle, style: Theme.of(context).textTheme.bodyMedium),
                ],
              ),
            ),
            if (isInteractive) ...[
              const SizedBox(width: 12),
              Icon(Icons.chevron_right, color: tokens.primary, size: 30),
            ],
          ],
        ),
      ),
    );

    if (!isInteractive) {
      return Semantics(label: '$title, $subtitle', child: card);
    }

    return Semantics(
      button: true,
      label: '$title, $subtitle',
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(14),
        child: card,
      ),
    );
  }
}
