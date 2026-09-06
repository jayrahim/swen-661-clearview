import 'package:flutter/material.dart';

import '../models/medical_note.dart';

class MedicalNoteDetailScreen extends StatelessWidget {
  const MedicalNoteDetailScreen({super.key, required this.note});

  final MedicalNote note;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        leading: Semantics(
          button: true,
          label: 'Back to Medical Notes',
          child: IconButton(
            tooltip: 'Back to Medical Notes',
            icon: const Icon(Icons.arrow_back),
            onPressed: () => Navigator.of(context).pop(),
          ),
        ),
        title: const Text('Visit Note'),
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          Text(note.title, style: Theme.of(context).textTheme.headlineSmall),
          const SizedBox(height: 8),
          Text(
            '${note.author} • ${_formatDate(note.createdAt)}',
            style: Theme.of(context).textTheme.bodyLarge,
          ),
          const SizedBox(height: 24),

          _NoteSection(
            title: 'Summary',
            child: Text(
              note.summary,
              style: Theme.of(context).textTheme.bodyLarge,
            ),
          ),

          if (note.assessment.isNotEmpty) ...[
            const SizedBox(height: 24),
            _NoteSection(
              title: 'Assessment',
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  for (final item in note.assessment) ...[
                    Padding(
                      padding: const EdgeInsets.only(bottom: 8),
                      child: Text(
                        '• $item',
                        style: Theme.of(context).textTheme.bodyLarge,
                      ),
                    ),
                  ],
                ],
              ),
            ),
          ],

          if (note.plan.isNotEmpty) ...[
            const SizedBox(height: 24),
            _NoteSection(
              title: 'Plan',
              child: Text(
                note.plan,
                style: Theme.of(context).textTheme.bodyLarge,
              ),
            ),
          ],

          const SizedBox(height: 24),

          Semantics(
            container: true,
            label: 'Need help understanding this note? Message your care team with a question.',
            child: Card(
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Need help understanding this note?',
                      style: Theme.of(context).textTheme.titleMedium,
                    ),
                    const SizedBox(height: 8),
                    Text(
                      'Message your care team with a question.',
                      style: Theme.of(context).textTheme.bodyLarge,
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

class _NoteSection extends StatelessWidget {
  const _NoteSection({required this.title, required this.child});

  final String title;
  final Widget child;

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(title, style: Theme.of(context).textTheme.titleLarge),
        const SizedBox(height: 8),
        child,
      ],
    );
  }
}
