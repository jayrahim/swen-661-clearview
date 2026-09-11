export const messages = Object.freeze([
  {
    id: 'msg-1',
    sender: 'Dr. David Chen',
    subject: 'Your lab results are available',
    preview: 'Your recent blood work is now available in CareConnect.',
    sentAt: new Date(2026, 7, 27, 8, 42),
    isRead: false,
    body:
      'Hi Maya,\n\n' +
      'Your recent blood work is now available in CareConnect. ' +
      'Most results are within the expected range. I added a note ' +
      'about your vitamin D level and would like you to review it ' +
      'before our next visit.',
    statusMessage: '✓ Results reviewed by care team',
    statusDetail: 'No urgent follow-up is required.',
    showLabResultsAction: true,
  },
  {
    id: 'msg-2',
    sender: 'Care Team',
    subject: 'Reminder: upcoming appointment',
    preview: 'You have an upcoming appointment.',
    sentAt: new Date(2026, 7, 26, 16, 10),
    isRead: false,
    body: null,
    statusMessage: null,
    statusDetail: null,
    showLabResultsAction: false,
  },
  {
    id: 'msg-3',
    sender: 'Vision Center',
    subject: 'Referral received',
    preview: 'Your referral has been received.',
    sentAt: new Date(2026, 7, 24, 11, 18),
    isRead: true,
    body: null,
    statusMessage: null,
    statusDetail: null,
    showLabResultsAction: false,
  },
  {
    id: 'msg-4',
    sender: 'Billing Support',
    subject: 'Statement available',
    preview: 'A new billing statement is available.',
    sentAt: new Date(2026, 7, 19, 14, 3),
    isRead: true,
    body: null,
    statusMessage: null,
    statusDetail: null,
    showLabResultsAction: false,
  },
]);
