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

test('provides complete native desktop menus and a restrictive renderer policy', async () => {
  const menuLabels = await app.evaluate(({ Menu }) => Menu.getApplicationMenu().items.map((item) => item.label));
  expect(menuLabels).toEqual(expect.arrayContaining(['File', 'Edit', 'View', 'Help']));
  await expect(window.locator('meta[http-equiv="Content-Security-Policy"]')).toHaveAttribute('content', /default-src 'self';/);
});

test('signs in and opens the desktop dashboard', async () => {
  await window.getByRole('button', { name: 'Sign in', exact: true }).click();
  await expect(window.getByRole('heading', { name: 'Good morning, Maya' })).toBeFocused();
  await expect(window.getByRole('navigation', { name: 'Primary navigation' })).toBeVisible();
  await expect(window.getByRole('status')).toHaveText('Signed in. Dashboard is ready.');
});

test('keeps focus visible and supports keyboard menu and dialog interactions', async () => {
  const viewMenu = window.getByRole('button', { name: 'View', exact: true });
  await viewMenu.focus();
  await expect(viewMenu).toBeFocused();
  await expect(viewMenu).toHaveCSS('outline-width', '3px');

  await window.keyboard.press('Enter');
  const toggleContrast = window.getByRole('menuitem', {
    name: 'Toggle high contrast',
  });
  await expect(toggleContrast).toBeFocused();
  await window.keyboard.press('ArrowDown');
  await expect(window.getByRole('menuitem', { name: 'Standard text' })).toBeFocused();
  await window.keyboard.press('Escape');
  await expect(viewMenu).toBeFocused();

  const shortcut = process.platform === 'darwin' ? 'Meta+/' : 'Control+/';
  await window.keyboard.press(shortcut);
  await expect(window.getByRole('dialog')).toBeVisible();
  await window.keyboard.press('Escape');
  await expect(window.getByRole('dialog')).toBeHidden();
});

test('uses the shared prototype-feedback language for password recovery', async () => {
  await window.reload();
  await window.getByRole('button', { name: 'Forgot password' }).click();
  await expect(window.getByRole('status')).toHaveText('Password recovery is not available in this prototype.');
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

  const nativeHighContrastChecked = await app.evaluate(({ Menu }) => Menu.getApplicationMenu()
    .items.find((item) => item.label === 'View')
    .submenu.items.find((item) => item.label === 'High contrast')?.checked);
  expect(nativeHighContrastChecked).toBe(true);
});

test('supports keyboard navigation and transfers focus to selected appointment details', async () => {
  await window.keyboard.press(process.platform === 'darwin' ? 'Meta+2' : 'Control+2');
  await expect(window.getByRole('heading', { name: 'Appointments' })).toBeFocused();

  await window.getByRole('button', { name: /Primary care follow-up/ }).click();
  await expect(window.getByRole('heading', { name: 'Primary care follow-up' })).toBeFocused();
  await expect(window.getByText('Review recent lab results and current medications.')).toBeVisible();
});

test('retains the messages, records, and settings workflows after renderer migration', async () => {
  await window.keyboard.press(process.platform === 'darwin' ? 'Meta+3' : 'Control+3');
  await expect(window.getByRole('heading', { name: 'Messages' })).toBeFocused();
  await expect(window.getByRole('button', { name: /Dr\. David Chen/ })).toBeVisible();

  await window.keyboard.press(process.platform === 'darwin' ? 'Meta+4' : 'Control+4');
  await expect(window.getByRole('heading', { name: 'Medical Notes' })).toBeFocused();
  await expect(window.getByRole('button', { name: /Primary Care Follow-up/ })).toBeVisible();

  await window.keyboard.press(process.platform === 'darwin' ? 'Meta+5' : 'Control+5');
  await expect(window.getByRole('heading', { name: 'Accessibility Settings' })).toBeFocused();
  await expect(window.getByRole('button', { name: /Text size.*Extra Large/ })).toBeVisible();
});
