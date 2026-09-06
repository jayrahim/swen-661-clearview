import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../models/appointment.dart';
import '../repositories/mock_repositories.dart';
import '../theme/app_colors.dart';
import '../theme/clearview_tokens.dart';
import '../utils/appointment_date_format.dart';
import '../widgets/ui_components.dart';
import 'accessibility_settings_screen.dart';
import 'appointment_detail_screen.dart';

class AppointmentsScreen extends ConsumerWidget {
  const AppointmentsScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final appointments = ref.watch(appointmentRepositoryProvider).getAll();
    void openSettings() => Navigator.of(context).push(
      MaterialPageRoute(builder: (_) => const AccessibilitySettingsScreen()),
    );
    return Scaffold(
      body: AppPage(
        child: Column(
          children: [
            const _AppointmentsHeader(),
            Expanded(
              child: SingleChildScrollView(
                padding: const EdgeInsets.fromLTRB(18, 20, 18, 22),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Upcoming',
                      style: Theme.of(context).textTheme.titleLarge,
                    ),
                    const SizedBox(height: 17),
                    for (final appointment in appointments) ...[
                      AppointmentListCard(
                        appointment: appointment,
                        onTap: () => Navigator.of(context).push(
                          MaterialPageRoute(
                            builder: (_) => AppointmentDetailScreen(
                              appointment: appointment,
                            ),
                          ),
                        ),
                      ),
                      const SizedBox(height: 20),
                    ],
                  ],
                ),
              ),
            ),
            ClearViewBottomNavigation(
              selectedItem: ClearViewNavigationItem.visits,
              // TODO(navigation): Replace stack-based root navigation when
              // deep links or centralized routes are introduced.
              onHomeTap: () =>
                  Navigator.of(context).popUntil((route) => route.isFirst),
              onSettingsTap: openSettings,
            ),
          ],
        ),
      ),
    );
  }
}

class _AppointmentsHeader extends StatelessWidget {
  const _AppointmentsHeader();

  @override
  Widget build(BuildContext context) {
    final tokens = context.clearViewTokens;
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.fromLTRB(18, 25, 18, 13),
      decoration: BoxDecoration(
        border: Border(
          bottom: BorderSide(color: tokens.border, width: tokens.borderWidth),
        ),
      ),
      child: Text(
        'Appointments',
        style: Theme.of(context).textTheme.headlineMedium,
      ),
    );
  }
}

class AppointmentListCard extends StatelessWidget {
  const AppointmentListCard({
    super.key,
    required this.appointment,
    required this.onTap,
  });

  final Appointment appointment;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    final appointmentLabel =
        '${appointment.clinicianName}, ${appointment.specialty}, ${appointmentAccessibilityLabel(appointment.scheduledAt)}, ${appointment.status.label}';
    return Semantics(
      button: true,
      label: appointmentLabel,
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(14),
        child: ExcludeSemantics(
          child: AppCard(
            padding: const EdgeInsets.all(13),
            child: LayoutBuilder(
              builder: (context, constraints) {
                final stackContent =
                    MediaQuery.textScalerOf(context).scale(1) > 1.2;
                final dateBadge = _AppointmentDateBadge(
                  date: appointment.scheduledAt,
                );
                final details = _AppointmentListDetails(
                  appointment: appointment,
                );
                return stackContent
                    ? Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          dateBadge,
                          const SizedBox(height: 12),
                          details,
                        ],
                      )
                    : Row(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          dateBadge,
                          const SizedBox(width: 16),
                          Expanded(child: details),
                        ],
                      );
              },
            ),
          ),
        ),
      ),
    );
  }
}

class _AppointmentListDetails extends StatelessWidget {
  const _AppointmentListDetails({required this.appointment});
  final Appointment appointment;

  @override
  Widget build(BuildContext context) {
    final tokens = context.clearViewTokens;
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          appointment.clinicianName,
          style: Theme.of(context).textTheme.titleMedium,
        ),
        const SizedBox(height: 7),
        Text(
          '${appointment.specialty} • ${appointment.location}',
          style: Theme.of(context).textTheme.bodyMedium,
        ),
        const SizedBox(height: 14),
        AppointmentStatusPill(status: appointment.status),
        const SizedBox(height: 10),
        Text(
          'View details ›',
          style: TextStyle(color: tokens.primary, fontWeight: FontWeight.w700),
        ),
      ],
    );
  }
}

class _AppointmentDateBadge extends StatelessWidget {
  const _AppointmentDateBadge({required this.date});
  final DateTime date;

  @override
  Widget build(BuildContext context) {
    final tokens = context.clearViewTokens;
    return Container(
      constraints: const BoxConstraints(minWidth: 74, minHeight: 68),
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 10),
      decoration: BoxDecoration(
        color: tokens.isHighContrast ? tokens.surface : AppColors.aqua,
        borderRadius: BorderRadius.circular(10),
        border: tokens.isHighContrast
            ? Border.all(color: tokens.border, width: tokens.borderWidth)
            : null,
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Text(
            appointmentBadgeLabel(date),
            style: TextStyle(
              color: tokens.primary,
              fontWeight: FontWeight.w700,
            ),
          ),
          const SizedBox(height: 8),
          Text(
            appointmentTimeLabel(date),
            style: TextStyle(color: tokens.ink, fontWeight: FontWeight.w700),
          ),
        ],
      ),
    );
  }
}
