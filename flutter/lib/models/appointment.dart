class Appointment {
  const Appointment({
    required this.id,
    required this.clinicianName,
    required this.specialty,
    required this.location,
    required this.scheduledAt,
    required this.status,
  });

  final String id;
  final String clinicianName;
  final String specialty;
  final String location;
  final DateTime scheduledAt;
  final String status;
}
