require("@testing-library/jest-dom");

Object.defineProperties(HTMLDialogElement.prototype, {
  close: {
    configurable: true,
    value() {
      this.open = false;
      this.dispatchEvent(new Event("close"));
    },
  },
  showModal: {
    configurable: true,
    value() {
      this.open = true;
    },
  },
});

function createDesktopBridge() {
  return {
    onNavigate: jest.fn(),
    onFocusSearch: jest.fn(),
    onOpenShortcuts: jest.fn(),
    onSetPreference: jest.fn(),
    requestClose: jest.fn(),
    updateMenuPreferences: jest.fn(),
  };
}

beforeEach(() => {
  window.clearViewDesktop = createDesktopBridge();
});

afterEach(() => {
  document.body.className = "";
});
