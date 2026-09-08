import 'package:flutter/material.dart';

import '../models/medical_note.dart';
import '../theme/clearview_tokens.dart';
import '../utils/appointment_date_format.dart';
import '../widgets/ui_components.dart';

class MedicalNoteDetailScreen extends StatelessWidget {
  const MedicalNoteDetailScreen({super.key, required this.note});

  final MedicalNote note;

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
                    tooltip: 'Back to medical notes',
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
                      'Visit Note',
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
                          '${note.title}, ${note.author}, ${dateOnlyLabel(note.createdAt)}',
                      child: ExcludeSemantics(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              note.title,
                              style: Theme.of(context).textTheme.headlineMedium,
                            ),
                            const SizedBox(height: 9),
                            Text(
                              '${note.author} • ${dateOnlyLabel(note.createdAt)}',
                              style: Theme.of(context).textTheme.bodyMedium,
                            ),
                          ],
                        ),
                      ),
                    ),
                    const SizedBox(height: 38),
                    _NoteSection(label: 'Summary', values: [note.summary]),
                    _NoteSection(label: 'Assessment', values: note.assessment),
                    _NoteSection(
                      label: 'Plan',
                      values: [note.plan],
                      showDivider: false,
                    ),
                    const SizedBox(height: 34),
                    _CareTeamPrompt(
                      onTap: () => ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(
                          content: Text(
                            'Messaging the care team is not available in this prototype.',
                          ),
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

class _NoteSection extends StatelessWidget {
  const _NoteSection({
    required this.label,
    required this.values,
    this.showDivider = true,
  });

  final String label;
  final List<String> values;
  final bool showDivider;

  @override
  Widget build(BuildContext context) {
    final tokens = context.clearViewTokens;
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.only(bottom: 25),
      margin: const EdgeInsets.only(bottom: 25),
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
          Text(label, style: Theme.of(context).textTheme.titleMedium),
          const SizedBox(height: 9),
          for (final entry in values.indexed) ...[
            Text(entry.$2, style: Theme.of(context).textTheme.bodyLarge),
            if (entry.$1 < values.length - 1) const SizedBox(height: 5),
          ],
        ],
      ),
    );
  }
}

class _CareTeamPrompt extends StatelessWidget {
  const _CareTeamPrompt({required this.onTap});

  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    final tokens = context.clearViewTokens;
    return Semantics(
      button: true,
      label: 'Need help understanding this note? Message your care team with a question.',
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(12),
        child: ExcludeSemantics(
          child: Container(
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
                  'Need help understanding this note?',
                  style: Theme.of(context).textTheme.titleMedium
                      ?.copyWith(color: tokens.primary),
                ),
                const SizedBox(height: 8),
                Text(
                  'Message your care team with a question.',
                  style: Theme.of(context).textTheme.bodyMedium,
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
