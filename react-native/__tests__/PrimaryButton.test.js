import { screen, userEvent } from '@testing-library/react-native';

import { PrimaryButton } from '../src/components/PrimaryButton';
import { renderWithProviders } from '../src/test-utils/renderWithProviders';

describe('PrimaryButton', () => {
  test('exposes an accessible action and invokes its handler', async () => {
    const onPress = jest.fn();
    const user = userEvent.setup();

    await renderWithProviders(<PrimaryButton label="Continue" onPress={onPress} />);

    await user.press(screen.getByRole('button', { name: 'Continue' }));

    expect(onPress).toHaveBeenCalledTimes(1);
  });

  test('does not invoke its handler when disabled', async () => {
    const onPress = jest.fn();
    const user = userEvent.setup();

    await renderWithProviders(
      <PrimaryButton disabled label="Continue" onPress={onPress} />,
    );

    await user.press(screen.getByRole('button', { name: 'Continue' }));

    expect(onPress).not.toHaveBeenCalled();
  });
});
