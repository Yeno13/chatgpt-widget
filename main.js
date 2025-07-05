const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
require('dotenv').config();

const apiKey = process.env.OPENAI_API_KEY;


function createWindow() {
  const win = new BrowserWindow({
    width: 400,
    height: 600,
    minWidth: 300,
    minHeight: 400,
    frame: false,
    transparent: true,
    vibrancy: 'ultra-dark',
    resizable: true,
    alwaysOnTop: false, // Not always on top
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      enableRemoteModule: false
    }
  });

  win.loadFile('index.html');
  console.log("✅ Main window created");

  win.on('blur', () => {
    win.webContents.send('window-blur');
  });

  win.on('focus', () => {
    win.webContents.send('window-focus');
  });

ipcMain.on('window-control', (event, action) => {
  const win = BrowserWindow.fromWebContents(event.sender);
  if (!win) return;

  if (action === 'minimize') {
    console.log("🟡 Minimizing window");
    win.minimize();
  } else if (action === 'close') {
    console.log("🔴 Closing window");
    win.close();
  } else {
    console.warn("⚠️ Unknown window action:", action);
  }
});
}

// Securely handle API key request from renderer
ipcMain.handle('get-api-key', async () => {
  console.log("🔑 API key requested from renderer");
  return apiKey;
});

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
