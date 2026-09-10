import { Pressable, Text } from 'react-native';
import { screen, userEvent } from '@testing-library/react-native';

import { usePrototypeFeedback } from '../src/components/PrototypeFeedback';
import { renderWithProviders } from '../src/test-utils/renderWithProviders';

function FeedbackControls() {
  const { showPrototypeFeedback } = usePrototypeFeedback();

  return (
    <>
      <Pressable
        accessibilityRole="button"
        onPress={() => showPrototypeFeedback('First message')}
      >
        <Text>First</Text>
      </Pressable>
      <Pressable
        accessibilityRole="button"
        onPress={() => showPrototypeFeedback('Replacement message')}
      >
        <Text>Replacement</Text>
      </Pressable>
    </>
  );
}

test('shows one accessible floating feedback message at a time', async () => {
  const user = userEvent.setup();

  await renderWithProviders(<FeedbackControls />);

  await user.press(screen.getByRole('button', { name: 'First' }));
  expect(screen.getByText('First message').parent).toHaveProp(
    'accessibilityRole',
    'alert',
  );
  expect(screen.getByText('First message').parent).toHaveStyle({
    bottom: 16,
    minHeight: 48,
  });

  await user.press(screen.getByRole('button', { name: 'Replacement' }));
  expect(screen.getByText('Replacement message')).toBeVisible();
  expect(screen.queryByText('First message')).not.toBeOnTheScreen();
});
