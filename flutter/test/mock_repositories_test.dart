import 'package:flutter_test/flutter_test.dart';

import 'package:clearview_flutter/models/appointment.dart';
import 'package:clearview_flutter/repositories/mock_repositories.dart';

void main() {
  test('appointment repository retrieves synthetic appointments by id', () {
    const repository = AppointmentRepository();
    final appointments = repository.getAll();

    expect(appointments, hasLength(3));
    expect(repository.getById('appt-1')?.clinicianName, 'Dr. Elena Martinez');
    expect(repository.getById('appt-2')?.location, 'Telehealth');
    expect(repository.getById('appt-3')?.status, AppointmentStatus.needsAction);
    expect(repository.getById('missing'), isNull);
  });

  test('message and medical note repositories supply synthetic data', () {
    const messages = MessageRepository();
    const notes = MedicalNoteRepository();
    expect(messages.getById('msg-1')?.subject, 'Appointment reminder');
    expect(notes.getById('note-1')?.author, 'Dr. David Chen');
  });
}
