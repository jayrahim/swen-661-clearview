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
      status: 'Confirmed',
    ),
    Appointment(
      id: 'appt-2',
      clinicianName: 'Dr. Noah Williams',
      specialty: 'Primary care',
      location: 'North Clinic',
      scheduledAt: DateTime(2026, 9, 22, 9),
      status: 'Scheduled',
    ),
      Appointment(
    id: 'appt-3',
    clinicianName: 'Vision Center',
    specialty: 'Ophthalmology',
    location: 'North Clinic',
    scheduledAt: DateTime(2026, 10, 2, 9, 15),
    status: 'Needs action',
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
