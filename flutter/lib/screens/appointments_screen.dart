import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../models/appointment.dart';
import '../repositories/mock_repositories.dart';
import '../theme/app_colors.dart';
import '../widgets/ui_components.dart';

class AppointmentsScreen extends ConsumerWidget {
  const AppointmentsScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final appointments = ref.watch(appointmentRepositoryProvider).getAll();

    return Scaffold(
      body: AppPage(
        child: Column(
          children: [
            Padding(
              padding: const EdgeInsets.fromLTRB(18, 25, 18, 12),
              child: Row(
                children: [
                  Expanded(
                    child: Text(
                      'Appointments',
                      style: Theme.of(context).textTheme.headlineMedium,
                    ),
                  ),
                  Semantics(
                    label: 'User profile',
                    child: const CircleAvatar(
                      radius: 20,
                      backgroundColor: AppColors.aqua,
                      child: Text(
                        'A',
                        style: TextStyle(
                          color: AppColors.primary,
                          fontWeight: FontWeight.w700,
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ),

            Expanded(
              child: ListView(
                padding: const EdgeInsets.fromLTRB(18, 6, 18, 18),
                children: [
                  Text(
                    'Upcoming',
                    style: Theme.of(context).textTheme.titleLarge,
                  ),
                  const SizedBox(height: 14),

                  ...appointments.map(
                    (appointment) => Padding(
                      padding: const EdgeInsets.only(bottom: 16),
                      child: _AppointmentCard(appointment: appointment),
                    ),
                  ),

                  const SizedBox(height: 8),

                  PrimaryButton(
                    label: 'Schedule appointment',
                    onPressed: () {},
                  ),
                ],
              ),
            ),
            const ClearViewBottomNavigation(
              selectedIndex: 1,
              ),
          ],
        ),
      ),
    );
  }
}

class _AppointmentCard extends StatelessWidget {
  const _AppointmentCard({required this.appointment});

  final Appointment appointment;

  @override
  Widget build(BuildContext context) {
    final needsAction = appointment.status.toLowerCase() == 'needs action';

    return Semantics(
      label:
          '${appointment.clinicianName}, '
          '${appointment.specialty}, '
          '${appointment.location}, '
          '${_formatShortDate(appointment.scheduledAt)}, '
          '${_formatTime(appointment.scheduledAt)}, '
          '${appointment.status}',
      child: AppCard(
        padding: const EdgeInsets.all(12),
        child: ExcludeSemantics(
          child: Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Container(
                width: 58,
                padding: const EdgeInsets.symmetric(vertical: 9, horizontal: 4),
                decoration: BoxDecoration(
                  color: AppColors.aqua,
                  borderRadius: BorderRadius.circular(10),
                ),
                child: Column(
                  children: [
                    Text(
                      _formatShortDate(appointment.scheduledAt),
                      textAlign: TextAlign.center,
                      style: const TextStyle(
                        color: AppColors.primary,
                        fontSize: 11,
                        fontWeight: FontWeight.w700,
                      ),
                    ),
                    const SizedBox(height: 8),
                    Text(
                      _formatTime(appointment.scheduledAt),
                      textAlign: TextAlign.center,
                      style: const TextStyle(
                        fontSize: 12,
                        fontWeight: FontWeight.w700,
                      ),
                    ),
                  ],
                ),
              ),

              const SizedBox(width: 12),

              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      appointment.clinicianName,
                      style: Theme.of(context).textTheme.titleMedium,
                    ),

                    const SizedBox(height: 5),

                    Text(
                      '${appointment.specialty} • ${appointment.location}',
                      style: Theme.of(context).textTheme.bodyMedium,
                    ),

                    const SizedBox(height: 10),

                    StatusPill(
                      label: appointment.status,
                      backgroundColor: needsAction
                          ? AppColors.yellowTile
                          : AppColors.mint,
                      foregroundColor: needsAction
                          ? const Color(0xFF8A4B00)
                          : AppColors.mintInk,
                    ),

                    const SizedBox(height: 7),

                    const Text(
                      'View details',
                      style: TextStyle(
                        color: AppColors.primary,
                        fontWeight: FontWeight.w700,
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

String _formatShortDate(DateTime dateTime) {
  const months = [
    'JAN',
    'FEB',
    'MAR',
    'APR',
    'MAY',
    'JUN',
    'JUL',
    'AUG',
    'SEP',
    'OCT',
    'NOV',
    'DEC',
  ];

  return '${months[dateTime.month - 1]} ${dateTime.day}';
}

String _formatTime(DateTime dateTime) {
  final hour = dateTime.hour % 12 == 0 ? 12 : dateTime.hour % 12;

  final minute = dateTime.minute.toString().padLeft(2, '0');

  final period = dateTime.hour >= 12 ? 'PM' : 'AM';

  return '$hour:$minute $period';
}
