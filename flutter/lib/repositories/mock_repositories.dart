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
      sender: 'Cardiology care team',
      subject: 'Appointment reminder',
      preview: 'Your upcoming visit is confirmed.',
      sentAt: DateTime(2026, 8, 27),
    ),
    Message(
      id: 'msg-2',
      sender: 'CareConnect',
      subject: 'New medical note',
      preview: 'A note is available to review.',
      sentAt: DateTime(2026, 8, 26),
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
      summary: 'Cardiology consultation note available for review.',
      assessment: [],
      plan: '',
      status: MedicalNoteStatus.newNote,
    ),
    MedicalNote(
      id: 'note-3',
      title: 'Vision Center Evaluation',
      author: 'Dr. Priya Shah',
      createdAt: DateTime(2026, 7, 14),
      summary: 'Vision center evaluation note available for review.',
      assessment: [],
      plan: '',
      status: MedicalNoteStatus.reviewed,
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
