import 'package:flutter/material.dart';

import '../models/appointment.dart';
import '../theme/app_colors.dart';
import '../widgets/ui_components.dart';

class AppointmentDetailScreen extends StatelessWidget {
  const AppointmentDetailScreen({super.key, required this.appointment});

  final Appointment appointment;

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
                    tooltip: 'Back to dashboard',
                    constraints: const BoxConstraints(
                      minWidth: 48,
                      minHeight: 48,
                    ),
                    icon: const Icon(
                      Icons.arrow_back_ios_new,
                      color: AppColors.primary,
                    ),
                    onPressed: () => Navigator.of(context).pop(),
                  ),
                ),
                const SizedBox(width: 12),
                Text(
                  'Appointment',
                  style: Theme.of(context).textTheme.headlineMedium,
                ),
              ],
            ),
          ),
          Expanded(
            child: SingleChildScrollView(
              padding: const EdgeInsets.all(18),
              child: Semantics(
                label:
                    'Appointment with ${appointment.clinicianName}, ${appointment.status}',
                child: AppCard(
                  child: ExcludeSemantics(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          appointment.status,
                          style: const TextStyle(
                            color: AppColors.mintInk,
                            fontWeight: FontWeight.w700,
                          ),
                        ),
                        const SizedBox(height: 16),
                        Text(
                          appointment.clinicianName,
                          style: Theme.of(context).textTheme.headlineMedium,
                        ),
                        const SizedBox(height: 16),
                        _DetailRow(
                          label: 'Date and time',
                          value: _formatDateTime(appointment.scheduledAt),
                        ),
                        _DetailRow(
                          label: 'Specialty',
                          value: appointment.specialty,
                        ),
                        _DetailRow(
                          label: 'Location',
                          value: appointment.location,
                        ),
                      ],
                    ),
                  ),
                ),
              ),
            ),
          ),
        ],
      ),
    ),
  );
}

String _formatDateTime(DateTime dateTime) {
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  final hour = dateTime.hour % 12 == 0 ? 12 : dateTime.hour % 12;
  final minute = dateTime.minute.toString().padLeft(2, '0');
  final period = dateTime.hour >= 12 ? 'PM' : 'AM';
  return '${months[dateTime.month - 1]} ${dateTime.day}, ${dateTime.year} at $hour:$minute $period';
}

class _DetailRow extends StatelessWidget {
  const _DetailRow({required this.label, required this.value});
  final String label;
  final String value;
  @override
  Widget build(BuildContext context) => Padding(
    padding: const EdgeInsets.only(bottom: 16),
    child: Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(label, style: Theme.of(context).textTheme.titleMedium),
        const SizedBox(height: 4),
        Text(value, style: Theme.of(context).textTheme.bodyLarge),
      ],
    ),
  );
}
