import '../models/appointment.dart';
import '../models/medical_note.dart';
import '../models/message.dart';

/// Read-only data boundary for appointments.
///
/// A future local or remote implementation can satisfy this contract without
/// requiring UI consumers to change.
abstract interface class AppointmentRepository {
  List<Appointment> getAll();
  Appointment? getById(String id);
}

/// Read-only data boundary for messages.
///
/// A future local or remote implementation can satisfy this contract without
/// requiring UI consumers to change.
abstract interface class MessageRepository {
  List<Message> getAll();
  Message? getById(String id);
}

/// Read-only data boundary for medical notes.
///
/// A future local or remote implementation can satisfy this contract without
/// requiring UI consumers to change.
abstract interface class MedicalNoteRepository {
  List<MedicalNote> getAll();
  MedicalNote? getById(String id);
}
