class MedicalNote {
  const MedicalNote({
    required this.id,
    required this.title,
    required this.author,
    required this.createdAt,
    required this.summary,
  });

  final String id;
  final String title;
  final String author;
  final DateTime createdAt;
  final String summary;
}
