import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../models/medical_note.dart';
import '../navigation/clearview_navigation.dart';
import '../repositories/mock_repositories.dart';
import '../theme/app_colors.dart';
import '../theme/clearview_tokens.dart';
import '../utils/appointment_date_format.dart';
import '../widgets/ui_components.dart';
import '../widgets/prototype_feedback.dart';
import 'accessibility_settings_screen.dart';
import 'appointments_screen.dart';
import 'medical_note_detail_screen.dart';
import 'messages_screen.dart';

class MedicalNotesScreen extends ConsumerWidget {
  const MedicalNotesScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final notes = ref.watch(medicalNoteRepositoryProvider).getAll();

    void openAppointments() =>
        ClearViewNavigation.push(context, const AppointmentsScreen());

    void openMessages() =>
        ClearViewNavigation.push(context, const MessagesScreen());

    void openSettings() => ClearViewNavigation.push(
      context,
      AccessibilitySettingsScreen(
        onVisitsTap: openAppointments,
        onMessagesTap: openMessages,
      ),
    );

    return ClearViewResponsiveScaffold(
      selectedItem: ClearViewNavigationItem.records,
      onHomeTap: () => ClearViewNavigation.returnHome(context),
      onVisitsTap: openAppointments,
      onMessagesTap: openMessages,
      onSettingsTap: openSettings,
      contentWidth: ClearViewContentWidth.reading,
      child: Column(
        children: [
          _MedicalNotesHeader(
            onFilterTap: () => showPrototypeFeedback(
              context,
              'Filtering is not available in this prototype.',
            ),
          ),
          Expanded(
            child: SingleChildScrollView(
              padding: const EdgeInsets.fromLTRB(18, 20, 18, 24),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Recent notes',
                    style: Theme.of(context).textTheme.titleLarge,
                  ),
                  const SizedBox(height: 17),
                  for (final note in notes) ...[
                    _MedicalNoteCard(
                      note: note,
                      onTap: () => ClearViewNavigation.push(
                        context,
                        MedicalNoteDetailScreen(
                          note: note,
                          onVisitsTap: openAppointments,
                          onSettingsTap: openSettings,
                          onMessagesTap: openMessages,
                        ),
                      ),
                    ),
                    const SizedBox(height: 20),
                  ],
                  const SizedBox(height: 23),
                  _AccessibilityGuidance(),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _MedicalNotesHeader extends StatelessWidget {
  const _MedicalNotesHeader({required this.onFilterTap});

  final VoidCallback onFilterTap;

  @override
  Widget build(BuildContext context) {
    final tokens = context.clearViewTokens;
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.fromLTRB(18, 25, 10, 13),
      decoration: BoxDecoration(
        border: Border(
          bottom: BorderSide(color: tokens.border, width: tokens.borderWidth),
        ),
      ),
      child: Row(
        children: [
          Expanded(
            child: Text(
              'Medical Notes',
              style: Theme.of(context).textTheme.headlineMedium,
            ),
          ),
          Semantics(
            button: true,
            label: 'Filter medical notes',
            child: TextButton(
              onPressed: onFilterTap,
              child: const Text('Filter'),
            ),
          ),
        ],
      ),
    );
  }
}

class _MedicalNoteCard extends StatelessWidget {
  const _MedicalNoteCard({required this.note, required this.onTap});

  final MedicalNote note;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    final tokens = context.clearViewTokens;
    return Semantics(
      button: true,
      label:
          '${note.status.label} note: ${note.title}, ${note.author}, ${dateOnlyLabel(note.createdAt)}',
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(14),
        child: ExcludeSemantics(
          child: AppCard(
            padding: const EdgeInsets.fromLTRB(13, 13, 13, 10),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  shortDateLabel(note.createdAt),
                  style: Theme.of(context).textTheme.bodyMedium
                      ?.copyWith(fontWeight: FontWeight.w700),
                ),
                const SizedBox(height: 12),
                Text(
                  note.title,
                  style: Theme.of(context).textTheme.titleMedium,
                ),
                const SizedBox(height: 8),
                Text(
                  note.author,
                  style: Theme.of(context).textTheme.bodyMedium,
                ),
                const SizedBox(height: 14),
                LayoutBuilder(
                  builder: (context, constraints) {
                    final openLabel = Text(
                      'Open ›',
                      style: TextStyle(
                        color: tokens.primary,
                        fontWeight: FontWeight.w700,
                      ),
                    );
                    final status = _MedicalNoteStatusPill(status: note.status);
                    final stackActions =
                        MediaQuery.textScalerOf(context).scale(1) > 1.3;
                    return stackActions
                        ? Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              status,
                              const SizedBox(height: 6),
                              openLabel,
                            ],
                          )
                        : Row(children: [status, const Spacer(), openLabel]);
                  },
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

class _MedicalNoteStatusPill extends StatelessWidget {
  const _MedicalNoteStatusPill({required this.status});

  final MedicalNoteStatus status;

  @override
  Widget build(BuildContext context) {
    final tokens = context.clearViewTokens;
    final isReviewed = status == MedicalNoteStatus.reviewed;
    final foreground = isReviewed ? AppColors.mintInk : tokens.primary;
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 7),
      decoration: BoxDecoration(
        color: tokens.isHighContrast
            ? tokens.surface
            : isReviewed
            ? AppColors.mint
            : AppColors.blueTile,
        borderRadius: BorderRadius.circular(18),
        border: tokens.isHighContrast
            ? Border.all(color: foreground, width: tokens.borderWidth)
            : null,
      ),
      child: Text(
        status.label,
        style: TextStyle(color: foreground, fontWeight: FontWeight.w700),
      ),
    );
  }
}

class _AccessibilityGuidance extends StatelessWidget {
  static const _guidance =
      'Notes use plain-language headings and flexible text blocks that expand when text size increases.';

  @override
  Widget build(BuildContext context) {
    final tokens = context.clearViewTokens;
    return Semantics(
      label: _guidance,
      child: ExcludeSemantics(
        child: Container(
          width: double.infinity,
          padding: const EdgeInsets.all(14),
          decoration: BoxDecoration(
            color: tokens.infoBackground,
            borderRadius: BorderRadius.circular(12),
            border: Border.all(
              color: tokens.infoBorder,
              width: tokens.borderWidth,
            ),
          ),
          child: Text(
            _guidance,
            style: Theme.of(context).textTheme.bodyMedium
                ?.copyWith(color: tokens.primary),
          ),
        ),
      ),
    );
  }
}
