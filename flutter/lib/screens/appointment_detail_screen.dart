import 'package:flutter/material.dart';

import '../models/appointment.dart';
import '../theme/clearview_tokens.dart';
import '../utils/appointment_date_format.dart';
import '../widgets/ui_components.dart';

class AppointmentDetailScreen extends StatelessWidget {
  const AppointmentDetailScreen({super.key, required this.appointment});

  final Appointment appointment;

  @override
  Widget build(BuildContext context) {
    final tokens = context.clearViewTokens;
    return Scaffold(
      body: AppPage(
        child: Column(
          children: [
            Container(
              width: double.infinity,
              padding: const EdgeInsets.fromLTRB(10, 25, 18, 13),
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
                  IconButton(
                    tooltip: 'Back to appointments',
                    constraints: const BoxConstraints(
                      minWidth: 48,
                      minHeight: 48,
                    ),
                    icon: Icon(Icons.arrow_back_ios_new, color: tokens.primary),
                    onPressed: () => Navigator.of(context).pop(),
                  ),
                  const SizedBox(width: 8),
                  Expanded(
                    child: Text(
                      'Appointment Details',
                      style: Theme.of(context).textTheme.headlineMedium,
                    ),
                  ),
                ],
              ),
            ),
            Expanded(
              child: SingleChildScrollView(
                padding: const EdgeInsets.fromLTRB(18, 20, 18, 28),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Semantics(
                      container: true,
                      label:
                          '${appointment.status.label}, ${appointment.visitTitle}, ${appointment.clinicianName}',
                      child: ExcludeSemantics(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            AppointmentStatusPill(status: appointment.status),
                            const SizedBox(height: 17),
                            Text(
                              appointment.visitTitle,
                              style: Theme.of(context).textTheme.headlineMedium,
                            ),
                            const SizedBox(height: 9),
                            Text(
                              appointment.clinicianName,
                              style: Theme.of(context).textTheme.titleLarge,
                            ),
                          ],
                        ),
                      ),
                    ),
                    const SizedBox(height: 29),
                    _DetailSection(
                      label: 'Date & time',
                      value: appointmentDetailLabel(appointment.scheduledAt),
                    ),
                    _DetailSection(
                      label: 'Location',
                      value: appointment.locationLabel,
                    ),
                    _DetailSection(
                      label: 'Visit type',
                      value: appointment.visitFormat.label,
                      showDivider: false,
                    ),
                    const SizedBox(height: 27),
                    Container(
                      width: double.infinity,
                      padding: const EdgeInsets.all(13),
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
                            'Before your visit',
                            style: Theme.of(context).textTheme.titleMedium
                                ?.copyWith(color: tokens.primary),
                          ),
                          const SizedBox(height: 8),
                          Text(
                            appointment.preparationNote,
                            style: Theme.of(context).textTheme.bodyLarge,
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 24),
                    PrimaryButton(
                      label: 'Get directions',
                      onPressed: () => _showPrototypeMessage(
                        context,
                        'Directions are not available in this prototype.',
                      ),
                    ),
                    const SizedBox(height: 8),
                    SizedBox(
                      width: double.infinity,
                      height: 53,
                      child: OutlinedButton(
                        onPressed: () => _showPrototypeMessage(
                          context,
                          'Rescheduling is not available in this prototype.',
                        ),
                        style: OutlinedButton.styleFrom(
                          foregroundColor: tokens.primary,
                          side: BorderSide(color: tokens.primary, width: 2),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(11),
                          ),
                        ),
                        child: const Text('Reschedule'),
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

void _showPrototypeMessage(BuildContext context, String message) {
  ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(message)));
}

class _DetailSection extends StatelessWidget {
  const _DetailSection({
    required this.label,
    required this.value,
    this.showDivider = true,
  });

  final String label;
  final String value;
  final bool showDivider;

  @override
  Widget build(BuildContext context) {
    final tokens = context.clearViewTokens;
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.only(bottom: 25),
      margin: const EdgeInsets.only(bottom: 18),
      decoration: BoxDecoration(
        border: showDivider
            ? Border(
                bottom: BorderSide(
                  color: tokens.border,
                  width: tokens.borderWidth,
                ),
              )
            : null,
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            label,
            style: Theme.of(context).textTheme.titleMedium
                ?.copyWith(color: tokens.mutedInk),
          ),
          const SizedBox(height: 9),
          Text(value, style: Theme.of(context).textTheme.bodyLarge),
        ],
      ),
    );
  }
}
