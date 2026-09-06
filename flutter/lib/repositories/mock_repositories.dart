import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../models/appointment.dart';
import '../models/medical_note.dart';
import '../models/message.dart';

class AppointmentRepository {
  const AppointmentRepository();
  static final _appointments = [
    Appointment(
      id: 'appt-1',
      clinicianName: 'Dr. Elena Martinez',
      specialty: 'Cardiology',
      location: 'Main Campus',
      scheduledAt: DateTime(2026, 9, 4, 10, 30),
      status: AppointmentStatus.confirmed,
      locationDetail: 'Building B, Floor 2',
      visitFormat: VisitFormat.inPersonFollowUp,
      preparationNote:
          'Bring your medication list and arrive 15 minutes early.',
    ),
    Appointment(
      id: 'appt-2',
      clinicianName: 'Dr. David Chen',
      specialty: 'Primary Care',
      location: 'Telehealth',
      scheduledAt: DateTime(2026, 9, 18, 14),
      status: AppointmentStatus.confirmed,
      visitFormat: VisitFormat.virtualFollowUp,
      preparationNote:
          'Join from a quiet place five minutes before your visit.',
    ),
    Appointment(
      id: 'appt-3',
      clinicianName: 'Vision Center',
      specialty: 'Ophthalmology',
      location: 'North Clinic',
      scheduledAt: DateTime(2026, 10, 2, 9, 15),
      status: AppointmentStatus.needsAction,
      locationDetail: 'Vision Center',
      visitFormat: VisitFormat.inPersonAppointment,
      preparationNote: 'Please contact the clinic to confirm this appointment.',
    ),
  ];
  List<Appointment> getAll() => List.unmodifiable(_appointments);
  Appointment? getById(String id) =>
      _appointments.where((item) => item.id == id).firstOrNull;
}

class MessageRepository {
  const MessageRepository();

  static final _messages = [
    Message(
      id: 'msg-1',
      sender: 'Dr. David Chen',
      subject: 'Your lab results are available',
      preview: 'Your recent blood work is now available in CareConnect.',
      sentAt: DateTime(2026, 8, 27, 8, 42),
      isRead: false,
      body:
          'Hi Maya,\n\n'
          'Your recent blood work is now available in CareConnect. '
          'Most results are within the expected range. I added a note '
          'about your vitamin D level and would like you to review it '
          'before our next visit.',
      statusMessage: '✓ Results reviewed by care team',
      statusDetail: 'No urgent follow-up is required.',
    ),
    Message(
      id: 'msg-2',
      sender: 'Care Team',
      subject: 'Reminder: upcoming appointment',
      preview: 'You have an upcoming appointment.',
      sentAt: DateTime(2026, 8, 26, 16, 10),
      isRead: false,
    ),
    Message(
      id: 'msg-3',
      sender: 'Vision Center',
      subject: 'Referral received',
      preview: 'Your referral has been received.',
      sentAt: DateTime(2026, 8, 24, 11, 18),
      isRead: true,
    ),
    Message(
      id: 'msg-4',
      sender: 'Billing Support',
      subject: 'Statement available',
      preview: 'A new billing statement is available.',
      sentAt: DateTime(2026, 8, 19, 14, 3),
      isRead: true,
    ),
  ];

  List<Message> getAll() => List.unmodifiable(_messages);

  Message? getById(String id) =>
      _messages.where((item) => item.id == id).firstOrNull;
}

class MedicalNoteRepository {
  const MedicalNoteRepository();
  static final _notes = [
    MedicalNote(
      id: 'note-1',
      title: 'Cardiology follow-up',
      author: 'Dr. Elena Martinez',
      createdAt: DateTime(2026, 8, 25),
      summary: 'Continue the current care plan and monitor symptoms.',
    ),
    MedicalNote(
      id: 'note-2',
      title: 'Annual wellness visit',
      author: 'Dr. Noah Williams',
      createdAt: DateTime(2026, 8, 12),
      summary: 'Preventive screening discussion and routine follow-up.',
    ),
  ];
  List<MedicalNote> getAll() => List.unmodifiable(_notes);
  MedicalNote? getById(String id) =>
      _notes.where((item) => item.id == id).firstOrNull;
}

final appointmentRepositoryProvider = Provider(
  (ref) => const AppointmentRepository(),
);
final messageRepositoryProvider = Provider((ref) => const MessageRepository());
final medicalNoteRepositoryProvider = Provider(
  (ref) => const MedicalNoteRepository(),
);
