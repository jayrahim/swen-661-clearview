import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../models/appointment.dart';
import '../models/medical_note.dart';
import '../models/message.dart';
import 'repository_contracts.dart';

class MockAppointmentRepository implements AppointmentRepository {
  const MockAppointmentRepository();

  static final List<Appointment> _appointments = List.unmodifiable([
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
  ]);

  @override
  List<Appointment> getAll() => _appointments;

  @override
  Appointment? getById(String id) =>
      _appointments.where((item) => item.id == id).firstOrNull;
}

class MockMessageRepository implements MessageRepository {
  const MockMessageRepository();

  static final List<Message> _messages = List.unmodifiable([
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
      showLabResultsAction: true,
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
  ]);

  @override
  List<Message> getAll() => _messages;

  @override
  Message? getById(String id) =>
      _messages.where((item) => item.id == id).firstOrNull;
}

class MockMedicalNoteRepository implements MedicalNoteRepository {
  const MockMedicalNoteRepository();

  static final List<MedicalNote> _notes = List.unmodifiable([
    MedicalNote(
      id: 'note-1',
      title: 'Primary Care Follow-up',
      author: 'Dr. David Chen',
      createdAt: DateTime(2026, 8, 21),
      summary: 'Routine follow-up. Maya reports stable symptoms and no new concerns.',
      assessment: [
        'Blood pressure remains well controlled.',
        'Vitamin D level is mildly low.',
      ],
      plan: 'Continue current medications. Begin vitamin D supplement and repeat labs in 12 weeks.',
      status: MedicalNoteStatus.reviewed,
    ),
    MedicalNote(
      id: 'note-2',
      title: 'Cardiology Consultation',
      author: 'Dr. Elena Martinez',
      createdAt: DateTime(2026, 7, 30),
      summary: 'Discussed recent symptoms and the next steps for cardiac care.',
      assessment: ['No urgent changes identified during this visit.'],
      plan: 'Continue monitoring symptoms and follow up as scheduled.',
      status: MedicalNoteStatus.newNote,
    ),
    MedicalNote(
      id: 'note-3',
      title: 'Vision Center Evaluation',
      author: 'Dr. Priya Shah',
      createdAt: DateTime(2026, 7, 14),
      summary: 'Reviewed vision changes and discussed supportive options.',
      assessment: ['Vision changes remain stable.'],
      plan: 'Continue the current care plan and contact the clinic with concerns.',
      status: MedicalNoteStatus.reviewed,
    ),
  ]);

  @override
  List<MedicalNote> getAll() => _notes;

  @override
  MedicalNote? getById(String id) =>
      _notes.where((item) => item.id == id).firstOrNull;
}

final appointmentRepositoryProvider = Provider<AppointmentRepository>(
  (ref) => const MockAppointmentRepository(),
);
final messageRepositoryProvider = Provider<MessageRepository>(
  (ref) => const MockMessageRepository(),
);
final medicalNoteRepositoryProvider = Provider<MedicalNoteRepository>(
  (ref) => const MockMedicalNoteRepository(),
);
