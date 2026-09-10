const notes = Object.freeze([
  Object.freeze({
    id: 'note-1',
    title: 'Primary Care Follow-up',
    author: 'Dr. David Chen',
    createdAt: new Date(2026, 7, 21),
    summary:
      'Routine follow-up. Maya reports stable symptoms and no new concerns.',
    assessment: Object.freeze([
      'Blood pressure remains well controlled.',
      'Vitamin D level is mildly low.',
    ]),
    plan: 'Continue current medications. Begin vitamin D supplement and repeat labs in 12 weeks.',
    status: 'Reviewed',
  }),
  Object.freeze({
    id: 'note-2',
    title: 'Cardiology Consultation',
    author: 'Dr. Elena Martinez',
    createdAt: new Date(2026, 6, 30),
    summary: 'Discussed recent symptoms and the next steps for cardiac care.',
    assessment: Object.freeze([
      'No urgent changes identified during this visit.',
    ]),
    plan: 'Continue monitoring symptoms and follow up as scheduled.',
    status: 'New',
  }),
  Object.freeze({
    id: 'note-3',
    title: 'Vision Center Evaluation',
    author: 'Dr. Priya Shah',
    createdAt: new Date(2026, 6, 14),
    summary: 'Reviewed vision changes and discussed supportive options.',
    assessment: Object.freeze(['Vision changes remain stable.']),
    plan: 'Continue the current care plan and contact the clinic with concerns.',
    status: 'Reviewed',
  }),
]);

export const medicalNotesRepository = Object.freeze({
  getAll: () => [...notes],
  getById: (id) => notes.find((note) => note.id === id),
});
