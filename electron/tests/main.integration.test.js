const mockReadFileSync = jest.fn();
const mockWriteFileSync = jest.fn();
const mockApp = {
  getPath: jest.fn(() => "/tmp/clearview"),
  isPackaged: false,
  on: jest.fn(),
  quit: jest.fn(),
  whenReady: jest.fn(() => Promise.resolve()),
};
const mockWebContents = {
  on: jest.fn(),
  send: jest.fn(),
  setWindowOpenHandler: jest.fn(),
};
const mockWindow = {
  getBounds: jest.fn(() => ({ height: 900, width: 1440, x: 20, y: 30 })),
  getNormalBounds: jest.fn(() => ({ height: 900, width: 1440, x: 20, y: 30 })),
  isMaximized: jest.fn(() => false),
  loadFile: jest.fn(),
  on: jest.fn(),
  webContents: mockWebContents,
};
const mockBrowserWindow = jest.fn(() => mockWindow);
mockBrowserWindow.fromWebContents = jest.fn();
mockBrowserWindow.getAllWindows = jest.fn(() => [mockWindow]);
mockBrowserWindow.getFocusedWindow = jest.fn(() => mockWindow);
const mockIpcMain = { on: jest.fn() };
const mockMenu = {
  buildFromTemplate: jest.fn((template) => ({ items: template })),
  setApplicationMenu: jest.fn(),
};
const mockScreen = {
  getAllDisplays: jest.fn(() => [
    { workArea: { height: 1080, width: 1920, x: 0, y: 0 } },
  ]),
};

jest.mock("node:fs", () => ({
  readFileSync: mockReadFileSync,
  writeFileSync: mockWriteFileSync,
}));

jest.mock("electron", () => ({
  app: mockApp,
  BrowserWindow: mockBrowserWindow,
  ipcMain: mockIpcMain,
  Menu: mockMenu,
  screen: mockScreen,
}));

function loadMainProcess() {
  let mainProcess;
  jest.isolateModules(() => {
    mainProcess = require("../main");
  });
  return mainProcess;
}

function eventFor(url) {
  return { sender: "renderer", senderFrame: { url } };
}

function handlerFor(channel) {
  return mockIpcMain.on.mock.calls.find(([name]) => name === channel)[1];
}

function menuItem(menu, label) {
  return (menu.items ?? menu).find((item) => item.label === label);
}

beforeEach(() => {
  jest.clearAllMocks();
  mockApp.getPath.mockReturnValue("/tmp/clearview");
  mockApp.isPackaged = false;
  mockApp.whenReady.mockImplementation(() => Promise.resolve());
  mockBrowserWindow.mockImplementation(() => mockWindow);
  mockBrowserWindow.getAllWindows.mockReturnValue([mockWindow]);
  mockBrowserWindow.getFocusedWindow.mockReturnValue(mockWindow);
  mockScreen.getAllDisplays.mockReturnValue([
    { workArea: { height: 1080, width: 1920, x: 0, y: 0 } },
  ]);
  mockWindow.isMaximized.mockReturnValue(false);
  mockWindow.getBounds.mockReturnValue({ height: 900, width: 1440, x: 20, y: 30 });
});

test("restores visible saved bounds and safely falls back for malformed state", () => {
  const mainProcess = loadMainProcess();
  mockReadFileSync.mockReturnValue(
    JSON.stringify({ height: 800, width: 1200, x: 100, y: 80 }),
  );
  expect(mainProcess.readWindowState()).toEqual({
    height: 800,
    minHeight: 700,
    minWidth: 1024,
    width: 1200,
    x: 100,
    y: 80,
  });

  mockReadFileSync.mockReturnValue("not JSON");
  expect(mainProcess.readWindowState()).toEqual(mainProcess.WINDOW_DEFAULTS);
});

test("keeps a valid size but discards an off-screen saved position", () => {
  const mainProcess = loadMainProcess();
  mockReadFileSync.mockReturnValue(
    JSON.stringify({ height: 900, width: 1300, x: 9000, y: 9000 }),
  );

  expect(mainProcess.readWindowState()).toEqual({
    height: 900,
    minHeight: 700,
    minWidth: 1024,
    width: 1300,
  });
});

test("creates a sandboxed window and blocks untrusted renderer navigation", () => {
  const mainProcess = loadMainProcess();
  mockReadFileSync.mockImplementation(() => {
    throw new Error("no saved state");
  });

  expect(mainProcess.createWindow()).toBe(mockWindow);
  expect(mockBrowserWindow).toHaveBeenCalledWith(
    expect.objectContaining({
      height: 900,
      minHeight: 700,
      minWidth: 1024,
      webPreferences: {
        contextIsolation: true,
        nodeIntegration: false,
        preload: expect.stringMatching(/preload\.js$/),
        sandbox: true,
      },
      width: 1440,
    }),
  );
  expect(mockWindow.loadFile).toHaveBeenCalledWith("index.html");
  expect(mockWebContents.setWindowOpenHandler).toHaveBeenCalledWith(
    expect.any(Function),
  );
  expect(mockWebContents.setWindowOpenHandler.mock.calls[0][0]()).toEqual({
    action: "deny",
  });

  const navigationHandler = mockWebContents.on.mock.calls.find(
    ([eventName]) => eventName === "will-navigate",
  )[1];
  const preventedEvent = { preventDefault: jest.fn() };
  navigationHandler(preventedEvent, "https://untrusted.example");
  expect(preventedEvent.preventDefault).toHaveBeenCalledTimes(1);

  navigationHandler(preventedEvent, mainProcess.APPLICATION_URL);
  expect(preventedEvent.preventDefault).toHaveBeenCalledTimes(1);
});

test("saves normal bounds securely and preserves maximized-window normal bounds", () => {
  const mainProcess = loadMainProcess();
  const normalBounds = { height: 800, width: 1200, x: 12, y: 34 };
  mockWindow.isMaximized.mockReturnValue(true);
  mockWindow.getNormalBounds.mockReturnValue(normalBounds);

  mainProcess.saveWindowState(mockWindow);

  expect(mockWriteFileSync).toHaveBeenCalledWith(
    "/tmp/clearview/window-state.json",
    JSON.stringify(normalBounds),
    { encoding: "utf8", mode: 0o600 },
  );
});

test("accepts only the approved preload IPC contract and valid preferences", () => {
  const mainProcess = loadMainProcess();
  mainProcess.registerIpcHandlers();
  const requestClose = handlerFor("request-close");
  const preferencesUpdated = handlerFor("preferences-updated");
  const trustedEvent = eventFor(mainProcess.APPLICATION_URL);
  const untrustedEvent = eventFor("https://untrusted.example");
  const closingWindow = { close: jest.fn() };
  mockBrowserWindow.fromWebContents.mockReturnValue(closingWindow);

  requestClose(trustedEvent);
  expect(mockBrowserWindow.fromWebContents).toHaveBeenCalledWith("renderer");
  expect(closingWindow.close).toHaveBeenCalledTimes(1);

  requestClose(untrustedEvent);
  expect(closingWindow.close).toHaveBeenCalledTimes(1);

  preferencesUpdated(untrustedEvent, {
    highContrast: true,
    textSize: "Extra Large",
  });
  preferencesUpdated(trustedEvent, { highContrast: "yes", textSize: "Large" });
  expect(mockMenu.setApplicationMenu).not.toHaveBeenCalled();

  preferencesUpdated(trustedEvent, {
    highContrast: true,
    textSize: "Extra Large",
  });
  expect(mockMenu.setApplicationMenu).toHaveBeenCalledTimes(1);
});

test("routes native menu actions to the focused renderer window", () => {
  const mainProcess = loadMainProcess();
  const menu = mainProcess.createApplicationMenu();
  const viewMenu = menuItem(menu, "View");
  const navigateMenu = menuItem(menu, "Navigate");
  const helpMenu = menuItem(menu, "Help");

  ["Home", "Visits", "Messages", "Records", "Settings"].forEach((label) =>
    menuItem(navigateMenu.submenu, label).click(),
  );
  menuItem(navigateMenu.submenu, "Search").click();
  menuItem(helpMenu.submenu, "Keyboard shortcuts").click();
  menuItem(viewMenu.submenu, "High contrast").click({ checked: true });
  const textSizeMenu = menuItem(viewMenu.submenu, "Text size");
  menuItem(textSizeMenu.submenu, "Standard").click();
  menuItem(textSizeMenu.submenu, "Large").click();
  menuItem(textSizeMenu.submenu, "Extra Large").click();

  expect(mockWebContents.send).toHaveBeenNthCalledWith(
    1,
    "navigate",
    "home",
  );
  expect(mockWebContents.send).toHaveBeenNthCalledWith(5, "navigate", "settings");
  expect(mockWebContents.send).toHaveBeenNthCalledWith(6, "focus-search");
  expect(mockWebContents.send).toHaveBeenNthCalledWith(7, "open-shortcuts");
  expect(mockWebContents.send).toHaveBeenNthCalledWith(
    8,
    "set-preference",
    "highContrast",
    true,
  );
  expect(mockWebContents.send).toHaveBeenNthCalledWith(
    9,
    "set-preference",
    "textSize",
    "Standard",
  );
  expect(mockWebContents.send).toHaveBeenNthCalledWith(
    10,
    "set-preference",
    "textSize",
    "Large",
  );
  expect(mockWebContents.send).toHaveBeenNthCalledWith(
    11,
    "set-preference",
    "textSize",
    "Extra Large",
  );
});

test("starts once Electron is ready and recreates a window after activation", async () => {
  const mainProcess = loadMainProcess();
  mockReadFileSync.mockImplementation(() => {
    throw new Error("no saved state");
  });

  await mainProcess.startApplication();

  expect(mockMenu.setApplicationMenu).toHaveBeenCalledTimes(1);
  expect(mockBrowserWindow).toHaveBeenCalledTimes(1);
  const activateHandler = mockApp.on.mock.calls.find(
    ([eventName]) => eventName === "activate",
  )[1];
  mockBrowserWindow.getAllWindows.mockReturnValue([]);
  activateHandler();
  expect(mockBrowserWindow).toHaveBeenCalledTimes(2);
});
