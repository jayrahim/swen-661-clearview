enum AppointmentStatus {
  confirmed('Confirmed'),
  needsAction('Needs action');

  const AppointmentStatus(this.label);
  final String label;
}

enum VisitFormat {
  inPersonFollowUp('In-person follow-up'),
  virtualFollowUp('Virtual follow-up'),
  inPersonAppointment('In-person appointment');

  const VisitFormat(this.label);
  final String label;
}

class Appointment {
  const Appointment({
    required this.id,
    required this.clinicianName,
    required this.specialty,
    required this.location,
    required this.scheduledAt,
    required this.status,
    required this.visitFormat,
    required this.preparationNote,
    this.locationDetail,
  });

  final String id;
  final String clinicianName;
  final String specialty;
  final String location;
  final DateTime scheduledAt;
  final AppointmentStatus status;
  final VisitFormat visitFormat;
  final String preparationNote;
  final String? locationDetail;

  String get visitTitle => '$specialty visit';

  String get locationLabel =>
      locationDetail == null ? location : '$location • $locationDetail';
}
