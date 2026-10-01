const { app, BrowserWindow, ipcMain, Menu, screen } = require("electron");
const fs = require("node:fs");
const path = require("node:path");
const { pathToFileURL } = require("node:url");

const WINDOW_DEFAULTS = Object.freeze({
  width: 1440,
  height: 900,
  minWidth: 1024,
  minHeight: 700,
});
const WINDOW_STATE_FILE = "window-state.json";
const APPLICATION_URL = pathToFileURL(
  path.join(__dirname, "index.html"),
).toString();
let applicationPreferences = { highContrast: false, textSize: "Standard" };

function isFiniteNumber(value) {
  return typeof value === "number" && Number.isFinite(value);
}

function isValidSize(bounds) {
  return (
    isFiniteNumber(bounds?.width) &&
    isFiniteNumber(bounds?.height) &&
    bounds.width >= WINDOW_DEFAULTS.minWidth &&
    bounds.height >= WINDOW_DEFAULTS.minHeight &&
    bounds.width <= 3840 &&
    bounds.height <= 2160
  );
}

function isVisibleOnAnyDisplay(bounds) {
  return screen
    .getAllDisplays()
    .some(
      ({ workArea }) =>
        bounds.x < workArea.x + workArea.width &&
        bounds.x + bounds.width > workArea.x &&
        bounds.y < workArea.y + workArea.height &&
        bounds.y + bounds.height > workArea.y,
    );
}

function readWindowState() {
  const fallback = { ...WINDOW_DEFAULTS };
  try {
    const statePath = path.join(app.getPath("userData"), WINDOW_STATE_FILE);
    const savedBounds = JSON.parse(fs.readFileSync(statePath, "utf8"));
    if (!isValidSize(savedBounds)) return fallback;

    const hasValidPosition =
      isFiniteNumber(savedBounds.x) && isFiniteNumber(savedBounds.y);
    return hasValidPosition && isVisibleOnAnyDisplay(savedBounds)
      ? { ...fallback, ...savedBounds }
      : { ...fallback, width: savedBounds.width, height: savedBounds.height };
  } catch {
    return fallback;
  }
}

function saveWindowState(mainWindow) {
  try {
    const statePath = path.join(app.getPath("userData"), WINDOW_STATE_FILE);
    const bounds = mainWindow.isMaximized()
      ? mainWindow.getNormalBounds()
      : mainWindow.getBounds();
    fs.writeFileSync(statePath, JSON.stringify(bounds), {
      encoding: "utf8",
      mode: 0o600,
    });
  } catch {
    // A failed state write must never prevent the user from closing the application.
  }
}

function isApplicationUrl(url) {
  return url === APPLICATION_URL || url.startsWith(`${APPLICATION_URL}#`);
}

function configureRendererSecurity(mainWindow) {
  mainWindow.webContents.setWindowOpenHandler(() => ({ action: "deny" }));
  mainWindow.webContents.on("will-navigate", (event, navigationUrl) => {
    if (!isApplicationUrl(navigationUrl)) event.preventDefault();
  });
}

function createWindow() {
  const mainWindow = new BrowserWindow({
    ...WINDOW_DEFAULTS,
    ...readWindowState(),
    title: "CareConnect ClearView",
    backgroundColor: "#f5f8fa",
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
      preload: path.join(__dirname, "preload.js"),
    },
  });

  configureRendererSecurity(mainWindow);
  mainWindow.on("close", () => saveWindowState(mainWindow));
  mainWindow.loadFile("index.html");
}

function sendToFocusedWindow(channel, ...args) {
  BrowserWindow.getFocusedWindow()?.webContents.send(channel, ...args);
}

function createApplicationMenu() {
  const viewSubmenu = [
    {
      label: "High contrast",
      type: "checkbox",
      checked: applicationPreferences.highContrast,
      click: (menuItem) => {
        applicationPreferences.highContrast = menuItem.checked;
        sendToFocusedWindow("set-preference", "highContrast", menuItem.checked);
      },
    },
    {
      label: "Text size",
      submenu: [
        {
          label: "Standard",
          type: "radio",
          checked: applicationPreferences.textSize === "Standard",
          click: () => updateTextSize("Standard"),
        },
        {
          label: "Large",
          type: "radio",
          checked: applicationPreferences.textSize === "Large",
          click: () => updateTextSize("Large"),
        },
        {
          label: "Extra Large",
          type: "radio",
          checked: applicationPreferences.textSize === "Extra Large",
          click: () => updateTextSize("Extra Large"),
        },
      ],
    },
    { type: "separator" },
    { role: "reload", label: "Reload" },
  ];

  if (!app.isPackaged) viewSubmenu.push({ role: "toggleDevTools" });

  return Menu.buildFromTemplate([
    { label: "File", submenu: [{ role: "close", label: "Close window" }] },
    {
      label: "Edit",
      submenu: [
        { role: "undo" },
        { role: "redo" },
        { type: "separator" },
        { role: "cut" },
        { role: "copy" },
        { role: "paste" },
        { role: "selectAll" },
      ],
    },
    { label: "View", submenu: viewSubmenu },
    {
      label: "Navigate",
      submenu: [
        {
          label: "Home",
          accelerator: "CommandOrControl+1",
          click: () => sendToFocusedWindow("navigate", "home"),
        },
        {
          label: "Visits",
          accelerator: "CommandOrControl+2",
          click: () => sendToFocusedWindow("navigate", "visits"),
        },
        {
          label: "Messages",
          accelerator: "CommandOrControl+3",
          click: () => sendToFocusedWindow("navigate", "messages"),
        },
        {
          label: "Records",
          accelerator: "CommandOrControl+4",
          click: () => sendToFocusedWindow("navigate", "records"),
        },
        {
          label: "Settings",
          accelerator: "CommandOrControl+5",
          click: () => sendToFocusedWindow("navigate", "settings"),
        },
      ],
    },
    {
      label: "Help",
      submenu: [
        {
          label: "Keyboard shortcuts",
          accelerator: "CommandOrControl+/",
          click: () => sendToFocusedWindow("open-shortcuts"),
        },
      ],
    },
  ]);
}

function updateTextSize(textSize) {
  applicationPreferences.textSize = textSize;
  sendToFocusedWindow("set-preference", "textSize", textSize);
}

function isTrustedRenderer(event) {
  return isApplicationUrl(event.senderFrame?.url ?? "");
}

function hasValidPreferences(preferences) {
  return (
    typeof preferences?.highContrast === "boolean" &&
    ["Standard", "Large", "Extra Large"].includes(preferences.textSize)
  );
}

app.whenReady().then(() => {
  Menu.setApplicationMenu(createApplicationMenu());
  ipcMain.on("request-close", (event) => {
    if (isTrustedRenderer(event))
      BrowserWindow.fromWebContents(event.sender)?.close();
  });
  ipcMain.on("preferences-updated", (event, preferences) => {
    if (!isTrustedRenderer(event) || !hasValidPreferences(preferences)) return;
    applicationPreferences = { ...preferences };
    Menu.setApplicationMenu(createApplicationMenu());
  });
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
