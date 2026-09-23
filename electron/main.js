const { app, BrowserWindow, ipcMain, Menu } = require('electron');

function createWindow() {
  const window = new BrowserWindow({
    width: 1440,
    height: 900,
    minWidth: 1024,
    minHeight: 700,
    title: 'CareConnect ClearView',
    backgroundColor: '#f5f8fa',
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
      preload: `${__dirname}/preload.js`,
    },
  });

  window.loadFile('index.html');
}

function sendToFocusedWindow(channel, ...args) {
  BrowserWindow.getFocusedWindow()?.webContents.send(channel, ...args);
}

function createApplicationMenu() {
  return Menu.buildFromTemplate([
    {
      label: 'File',
      submenu: [{ role: 'close', label: 'Close window' }],
    },
    {
      label: 'View',
      submenu: [
        { label: 'High contrast', type: 'checkbox', click: () => sendToFocusedWindow('set-preference', 'highContrast') },
        {
          label: 'Text size',
          submenu: [
            { label: 'Standard', type: 'radio', click: () => sendToFocusedWindow('set-preference', 'textSize', 'Standard') },
            { label: 'Large', type: 'radio', click: () => sendToFocusedWindow('set-preference', 'textSize', 'Large') },
            { label: 'Extra Large', type: 'radio', click: () => sendToFocusedWindow('set-preference', 'textSize', 'Extra Large') },
          ],
        },
        { type: 'separator' },
        { role: 'reload', label: 'Reload' },
        { role: 'toggleDevTools' },
      ],
    },
    {
      label: 'Navigate',
      submenu: [
        { label: 'Home', accelerator: 'CommandOrControl+1', click: () => sendToFocusedWindow('navigate', 'home') },
        { label: 'Visits', accelerator: 'CommandOrControl+2', click: () => sendToFocusedWindow('navigate', 'visits') },
        { label: 'Messages', accelerator: 'CommandOrControl+3', click: () => sendToFocusedWindow('navigate', 'messages') },
        { label: 'Records', accelerator: 'CommandOrControl+4', click: () => sendToFocusedWindow('navigate', 'records') },
        { label: 'Settings', accelerator: 'CommandOrControl+5', click: () => sendToFocusedWindow('navigate', 'settings') },
      ],
    },
    {
      label: 'Help',
      submenu: [{ label: 'Keyboard shortcuts', accelerator: 'CommandOrControl+/', click: () => sendToFocusedWindow('open-shortcuts') }],
    },
  ]);
}

app.whenReady().then(() => {
  Menu.setApplicationMenu(createApplicationMenu());
  ipcMain.on('request-close', (event) => BrowserWindow.fromWebContents(event.sender)?.close());
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
