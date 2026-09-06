class MedicalNote {
  const MedicalNote({
    required this.id,
    required this.title,
    required this.author,
    required this.createdAt,
    required this.summary,
    required this.assessment,
    required this.plan,
    required this.status,
  });

  final String id;
  final String title;
  final String author;
  final DateTime createdAt;
  final String summary;
  final List<String> assessment;
  final String plan;
  final MedicalNoteStatus status;
}

enum MedicalNoteStatus { reviewed, newNote }

extension MedicalNoteStatusLabel on MedicalNoteStatus {
  String get label {
    switch (this) {
      case MedicalNoteStatus.reviewed:
        return 'Reviewed';
      case MedicalNoteStatus.newNote:
        return 'New';
    }
  }
}
