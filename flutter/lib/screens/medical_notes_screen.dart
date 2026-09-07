import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../models/medical_note.dart';
import '../repositories/mock_repositories.dart';
import '../utils/appointment_date_format.dart';
import '../widgets/ui_components.dart';
import 'accessibility_settings_screen.dart';
import 'appointments_screen.dart';
import 'dashboard_screen.dart';
import 'medical_note_detail_screen.dart';

class MedicalNotesScreen extends ConsumerWidget {
  const MedicalNotesScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final notes = ref.watch(medicalNoteRepositoryProvider).getAll();

    void openDashboard() {
      Navigator.of(context).pushAndRemoveUntil(
        MaterialPageRoute(builder: (_) => const DashboardScreen()),
        (route) => false,
      );
    }

    void openVisits() {
      Navigator.of(context).pushReplacement(
        MaterialPageRoute(builder: (_) => const AppointmentsScreen()),
      );
    }

    void openSettings() {
      Navigator.of(context).pushReplacement(
        MaterialPageRoute(builder: (_) => const AccessibilitySettingsScreen()),
      );
    }

    return Scaffold(
      body: AppPage(
        child: Column(
          children: [
            Container(
              width: double.infinity,
              padding: const EdgeInsets.fromLTRB(18, 25, 18, 13),
              decoration: BoxDecoration(
                border: Border(
                  bottom: BorderSide(color: Theme.of(context).dividerColor),
                ),
              ),
              child: Text(
                'Medical Notes',
                style: Theme.of(context).textTheme.headlineMedium,
              ),
            ),

            Expanded(
              child: SingleChildScrollView(
                padding: const EdgeInsets.fromLTRB(18, 20, 18, 22),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Recent notes',
                      style: Theme.of(context).textTheme.titleLarge,
                    ),
                    const SizedBox(height: 17),

                    for (final note in notes) ...[
                      _MedicalNoteCard(note: note),
                      const SizedBox(height: 20),
                    ],

                    const SizedBox(height: 4),

                    Semantics(
                      container: true,
                      label: 'Accessibility information. Notes use plain-language headings and flexible text blocks that expand when text size increases.',
                      child: AppCard(
                        padding: const EdgeInsets.all(16),
                        child: Row(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            const Icon(Icons.accessibility_new),
                            const SizedBox(width: 12),
                            Expanded(
                              child: Text(
                                'Notes use plain-language headings and flexible text blocks '
                                'that expand when text size increases.',
                                style: Theme.of(context).textTheme.bodyLarge,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),

            ClearViewBottomNavigation(
              selectedItem: ClearViewNavigationItem.records,

              // Home → Dashboard
              onHomeTap: openDashboard,

              // Visits → Appointments
              onVisitsTap: openVisits,

              // Records → Medical Notes
              onRecordsTap: () {},

              // Settings → Accessibility Settings
              onSettingsTap: openSettings,
            ),
          ],
        ),
      ),
    );
  }
}

class _MedicalNoteCard extends StatelessWidget {
  const _MedicalNoteCard({required this.note});

  final MedicalNote note;

  @override
  Widget build(BuildContext context) {
    return AppCard(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Expanded(
                child: Text(
                  note.title,
                  style: Theme.of(context).textTheme.titleLarge,
                ),
              ),
              _StatusBadge(status: note.status),
            ],
          ),
          const SizedBox(height: 8),
          Text(
            '${dateOnlyLabel(note.createdAt)} • ${note.author}',
            style: Theme.of(context).textTheme.bodyLarge,
          ),
          const SizedBox(height: 12),
          Text(note.summary, style: Theme.of(context).textTheme.bodyLarge),
          const SizedBox(height: 12),
          Align(
            alignment: Alignment.centerRight,
            child: Semantics(
              button: true,
              label: 'Open ${note.title}',
              child: ConstrainedBox(
                constraints: const BoxConstraints(minWidth: 48, minHeight: 48),
                child: OutlinedButton(
                  onPressed: () {
                    Navigator.of(context).push(
                      MaterialPageRoute(
                        builder: (_) => MedicalNoteDetailScreen(note: note),
                      ),
                    );
                  },
                  child: const Text('Open →'),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _StatusBadge extends StatelessWidget {
  const _StatusBadge({required this.status});

  final MedicalNoteStatus status;

  @override
  Widget build(BuildContext context) {
    return Semantics(
      label: 'Note status: ${status.label}',
      child: Container(
        constraints: const BoxConstraints(minHeight: 32, minWidth: 48),
        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
        decoration: BoxDecoration(
          border: Border.all(color: Theme.of(context).dividerColor),
          borderRadius: BorderRadius.circular(16),
        ),
        child: Text(
          status.label,
          style: Theme.of(context).textTheme.labelLarge,
        ),
      ),
    );
  }
}
