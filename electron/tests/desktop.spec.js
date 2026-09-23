const path = require('path');
const { test, expect, _electron: electron } = require('@playwright/test');

test.describe.configure({ mode: 'serial' });

let app;
let window;

test.beforeAll(async () => {
  const environment = { ...process.env };
  delete environment.ELECTRON_RUN_AS_NODE;

  app = await electron.launch({
    args: [path.resolve(__dirname, '..')],
    env: environment,
  });
  window = await app.firstWindow();
});

test.afterAll(async () => {
  await app?.close();
});

test('renders an accessible sign-in screen with an isolated renderer', async () => {
  await expect(window.getByRole('heading', { name: 'Sign in to CareConnect' })).toBeVisible();
  await expect(window.getByLabel('Email')).toHaveValue('maya.carter@example.com');
  await expect(window.getByLabel('Password')).toHaveAttribute('type', 'password');
  await expect(window.getByRole('button', { name: 'Sign in', exact: true })).toBeVisible();
  await expect(window.locator('body')).not.toHaveClass(/high-contrast/);

  await expect(window.evaluate(() => typeof window.require)).resolves.toBe('undefined');
  await expect(window.evaluate(() => typeof window.process)).resolves.toBe('undefined');
});

test('signs in and opens the desktop dashboard', async () => {
  await window.getByRole('button', { name: 'Sign in', exact: true }).click();
  await expect(window.getByRole('heading', { name: 'Good morning, Maya' })).toBeFocused();
  await expect(window.getByRole('navigation', { name: 'Primary navigation' })).toBeVisible();
  await expect(window.getByRole('status')).toHaveText('Signed in. Dashboard is ready.');
});

test('submits the sign-in form from Enter', async () => {
  await window.reload();
  await expect(window.getByRole('heading', { name: 'Sign in to CareConnect' })).toBeVisible();
  await window.getByLabel('Password').press('Enter');
  await expect(window.getByRole('heading', { name: 'Good morning, Maya' })).toBeFocused();
});

test('applies accessibility preferences from the View menu', async () => {
  await window.getByRole('button', { name: 'View', exact: true }).click();
  await window.getByRole('menuitem', { name: 'Extra Large text' }).click();
  await expect(window.locator('body')).toHaveClass(/text-extra-large/);
  await expect(window.getByRole('status')).toHaveText('Text size set to Extra Large.');

  await window.getByRole('button', { name: 'View', exact: true }).click();
  await window.getByRole('menuitem', { name: 'Toggle high contrast' }).click();
  await expect(window.locator('body')).toHaveClass(/high-contrast/);
  await expect(window.getByRole('status')).toHaveText('High contrast enabled.');
});

test('supports keyboard navigation and transfers focus to selected appointment details', async () => {
  await window.keyboard.press(process.platform === 'darwin' ? 'Meta+2' : 'Control+2');
  await expect(window.getByRole('heading', { name: 'Appointments' })).toBeFocused();

  await window.getByRole('button', { name: /Primary care follow-up/ }).click();
  await expect(window.getByRole('heading', { name: 'Primary care follow-up' })).toBeFocused();
  await expect(window.getByText('Review recent lab results and current medications.')).toBeVisible();
});
