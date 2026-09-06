import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../models/medical_note.dart';
import '../repositories/mock_repositories.dart';
import 'medical_note_detail_screen.dart';

class MedicalNotesScreen extends ConsumerWidget {
  const MedicalNotesScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final notes = ref.read(medicalNoteRepositoryProvider).getAll();

    return Scaffold(
      appBar: AppBar(
        title: const Text('Medical Notes'),
        actions: [
          Semantics(
            button: true,
            label: 'Filter medical notes',
            child: IconButton(
              tooltip: 'Filter medical notes',
              icon: const Icon(Icons.filter_list),
              onPressed: () {
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(
                    content: Text(
                      'Note filtering is not available in this prototype.',
                    ),
                  ),
                );
              },
            ),
          ),
        ],
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          Text(
            'Recent notes',
            style: Theme.of(context).textTheme.headlineSmall,
          ),
          const SizedBox(height: 16),

          for (final note in notes) ...[
            _MedicalNoteCard(note: note),
            const SizedBox(height: 12),
          ],

          const SizedBox(height: 8),

          Semantics(
            container: true,
            label: 'Accessibility information. Notes use plain-language headings and flexible text blocks that expand when text size increases.',
            child: Card(
              child: Padding(
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
          ),
        ],
      ),
    );
  }
}

class _MedicalNoteCard extends StatelessWidget {
  const _MedicalNoteCard({required this.note});

  final MedicalNote note;

  @override
  Widget build(BuildContext context) {
    return Card(
      child: Padding(
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
              '${_formatDate(note.createdAt)} • ${note.author}',
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
          ],
        ),
      ),
    );
  }

  String _formatDate(DateTime date) {
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

    return '${months[date.month - 1]} ${date.day}, ${date.year}';
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
          border: Border.all(),
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
