const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('clearViewDesktop', {
  onNavigate(listener) {
    ipcRenderer.on('navigate', (_event, page) => listener(page));
  },
  onOpenShortcuts(listener) {
    ipcRenderer.on('open-shortcuts', listener);
  },
  onSetPreference(listener) {
    ipcRenderer.on('set-preference', (_event, name, value) => listener(name, value));
  },
  requestClose() {
    ipcRenderer.send('request-close');
  },
});
