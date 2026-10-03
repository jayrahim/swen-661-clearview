const mockExposeInMainWorld = jest.fn();
const mockOn = jest.fn();
const mockSend = jest.fn();

jest.mock("electron", () => ({
  contextBridge: { exposeInMainWorld: mockExposeInMainWorld },
  ipcRenderer: { on: mockOn, send: mockSend },
}));

function loadPreload() {
  jest.isolateModules(() => {
    require("../preload");
  });
  return mockExposeInMainWorld.mock.calls[0][1];
}

beforeEach(() => {
  jest.clearAllMocks();
});

test("exposes only the approved renderer-to-main desktop API", () => {
  const desktopApi = loadPreload();

  expect(mockExposeInMainWorld).toHaveBeenCalledWith(
    "clearViewDesktop",
    expect.objectContaining({
      onNavigate: expect.any(Function),
      onFocusSearch: expect.any(Function),
      onOpenShortcuts: expect.any(Function),
      onSetPreference: expect.any(Function),
      requestClose: expect.any(Function),
      updateMenuPreferences: expect.any(Function),
    }),
  );
  expect(Object.keys(desktopApi)).toEqual([
    "onNavigate",
    "onFocusSearch",
    "onOpenShortcuts",
    "onSetPreference",
    "requestClose",
    "updateMenuPreferences",
  ]);
});

test("bridges only expected inbound events and outbound IPC messages", () => {
  const desktopApi = loadPreload();
  const onNavigate = jest.fn();
  const onFocusSearch = jest.fn();
  const onOpenShortcuts = jest.fn();
  const onSetPreference = jest.fn();

  desktopApi.onNavigate(onNavigate);
  desktopApi.onFocusSearch(onFocusSearch);
  desktopApi.onOpenShortcuts(onOpenShortcuts);
  desktopApi.onSetPreference(onSetPreference);
  desktopApi.requestClose();
  desktopApi.updateMenuPreferences({ highContrast: true, textSize: "Large" });

  expect(mockOn.mock.calls.map(([channel]) => channel)).toEqual([
    "navigate",
    "focus-search",
    "open-shortcuts",
    "set-preference",
  ]);
  mockOn.mock.calls[0][1]({}, "messages");
  mockOn.mock.calls[1][1]({});
  mockOn.mock.calls[2][1]({});
  mockOn.mock.calls[3][1]({}, "textSize", "Large");
  expect(onNavigate).toHaveBeenCalledWith("messages");
  expect(onFocusSearch).toHaveBeenCalledWith();
  expect(onOpenShortcuts).toHaveBeenCalledWith();
  expect(onSetPreference).toHaveBeenCalledWith("textSize", "Large");
  expect(mockSend).toHaveBeenNthCalledWith(1, "request-close");
  expect(mockSend).toHaveBeenNthCalledWith(2, "preferences-updated", {
    highContrast: true,
    textSize: "Large",
  });
});
