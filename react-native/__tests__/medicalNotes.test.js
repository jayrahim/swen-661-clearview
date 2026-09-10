import { screen, userEvent } from '@testing-library/react-native';

import { medicalNotesRepository } from '../src/data/medicalNotes';
import { MedicalNoteDetailScreen } from '../src/screens/MedicalNoteDetailScreen';
import { MedicalNotesScreen } from '../src/screens/MedicalNotesScreen';
import { defaultAccessibilityPreferences } from '../src/state/accessibilityPreferences';
import { renderWithProviders } from '../src/test-utils/renderWithProviders';
import { resolveTheme, scaledFontSize } from '../src/theme/tokens';
import {
  medicalNoteDate,
  medicalNoteShortDate,
} from '../src/utils/medicalNoteFormat';

describe('medicalNotesRepository', () => {
  test('returns an ordered copy of the synthetic notes', () => {
    const firstRead = medicalNotesRepository.getAll();
    const secondRead = medicalNotesRepository.getAll();

    expect(firstRead).toHaveLength(3);
    expect(firstRead.map(({ id }) => id)).toEqual([
      'note-1',
      'note-2',
      'note-3',
    ]);
    expect(secondRead).not.toBe(firstRead);

    firstRead.pop();
    expect(medicalNotesRepository.getAll()).toHaveLength(3);
  });

  test('finds a note by stable id and returns undefined for an unknown id', () => {
    expect(medicalNotesRepository.getById('note-2')).toMatchObject({
      author: 'Dr. Elena Martinez',
      status: 'New',
    });
    expect(medicalNotesRepository.getById('missing')).toBeUndefined();
  });
});

test('formats note dates without locale-dependent output', () => {
  const note = medicalNotesRepository.getById('note-2');

  expect(medicalNoteShortDate(note.createdAt)).toBe('Jul 30');
  expect(medicalNoteDate(note.createdAt)).toBe('July 30, 2026');
});

test('list renders repository data, selects a note, and provides filter feedback', async () => {
  const user = userEvent.setup();
  const onSelect = jest.fn();

  await renderWithProviders(
    <MedicalNotesScreen onNavigate={{ home: jest.fn() }} onSelect={onSelect} />,
  );

  expect(screen.getByRole('header', { name: 'Medical Notes' })).toBeVisible();
  expect(screen.getByRole('header', { name: 'Recent notes' })).toBeVisible();
  expect(
    screen.getByRole('button', {
      name: 'New note: Cardiology Consultation, Dr. Elena Martinez, Jul 30',
    }),
  ).toBeVisible();

  await user.press(
    screen.getByRole('button', {
      name: 'New note: Cardiology Consultation, Dr. Elena Martinez, Jul 30',
    }),
  );
  expect(onSelect).toHaveBeenCalledWith(
    medicalNotesRepository.getById('note-2'),
  );

  await user.press(
    screen.getByRole('button', { name: 'Filter medical notes' }),
  );
  expect(
    screen.getByText('Filtering is not available in this prototype.'),
  ).toBeVisible();
});

test('detail renders the selected note, assessment entries, and care-team feedback', async () => {
  const user = userEvent.setup();
  const onBack = jest.fn();

  await renderWithProviders(
    <MedicalNoteDetailScreen
      note={medicalNotesRepository.getById('note-1')}
      onBack={onBack}
    />,
  );

  expect(screen.getByRole('header', { name: 'Visit Note' })).toBeVisible();
  expect(screen.getByText('Primary Care Follow-up')).toBeVisible();
  expect(
    screen.getByText('Blood pressure remains well controlled.'),
  ).toBeVisible();
  expect(screen.getByText('Vitamin D level is mildly low.')).toBeVisible();

  await user.press(
    screen.getByRole('button', { name: 'Back to medical notes' }),
  );
  expect(onBack).toHaveBeenCalledTimes(1);

  await user.press(
    screen.getByRole('button', {
      name: 'Need help understanding this note? Message your care team with a question.',
    }),
  );
  expect(
    screen.getByText(
      'Messaging the care team is not available in this prototype.',
    ),
  ).toBeVisible();
});

test('list and detail apply high-contrast tokens and scaled text', async () => {
  const preferences = {
    ...defaultAccessibilityPreferences,
    highContrast: true,
    textSize: { id: 'extra-large', label: 'Extra large', scale: 1.15 },
  };
  const theme = resolveTheme(preferences);

  await renderWithProviders(<MedicalNotesScreen onSelect={jest.fn()} />, {
    initialPreferences: preferences,
  });
  expect(screen.getAllByText('Reviewed')[0].parent).toHaveStyle({
    backgroundColor: '#FFFFFF',
    borderColor: '#16744A',
    borderWidth: 2,
  });
  expect(screen.getByRole('header', { name: 'Medical Notes' })).toHaveStyle({
    fontSize: scaledFontSize(24, theme),
  });

  await renderWithProviders(
    <MedicalNoteDetailScreen
      note={medicalNotesRepository.getById('note-1')}
      onBack={jest.fn()}
    />,
    { initialPreferences: preferences },
  );
  expect(screen.getByText('Summary').parent).toHaveStyle({
    borderBottomColor: '#111827',
    borderBottomWidth: 2,
  });
  expect(
    screen.getByText('Need help understanding this note?').parent,
  ).toHaveStyle({
    backgroundColor: '#FFFFFF',
    borderColor: '#111827',
    borderWidth: 2,
  });
});
