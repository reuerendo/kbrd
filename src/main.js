const { app, BrowserWindow, Tray, Menu, screen } = require('electron');
const path = require('path');

let mainWindow;
let tray;

function createWindow() {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;

  mainWindow = new BrowserWindow({
    width: 800, // Чуть больше панели (760px + отступы)
    height: 350,
    x: width - 820, // Позиция справа
    y: height - 360, // Позиция снизу
    frame: false, // Убираем рамки Windows
    transparent: true, // Прозрачность для эффектов Fluent
    resizable: false,
    alwaysOnTop: true, // Всегда поверх других окон
    skipTaskbar: true, // Не показывать в основной панели задач (только трей)
    focusable: false, // ВАЖНО: Клавиатура не должна отбирать фокус у ввода
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  mainWindow.loadFile(path.join(__dirname, 'index.html'));
  // mainWindow.webContents.openDevTools({ mode: 'detach' }); // Для отладки
}

app.whenReady().then(() => {
  // 1. Создаем иконку в трее
  const iconPath = path.join(__dirname, '../assets/icon.ico'); 
  // Примечание: для запуска создайте пустой файл icon.ico или используйте любой существующий
  
  tray = new Tray(iconPath);
  const contextMenu = Menu.buildFromTemplate([
    { label: 'Show Keyboard', click: () => mainWindow.show() },
    { label: 'Hide Keyboard', click: () => mainWindow.hide() },
    { type: 'separator' },
    { label: 'Exit', click: () => app.quit() }
  ]);
  
  tray.setToolTip('Virtual Keyboard');
  tray.setContextMenu(contextMenu);

  // Обработка клика по иконке (Toggle)
  tray.on('click', () => {
    if (mainWindow.isVisible()) {
      mainWindow.hide();
    } else {
      mainWindow.show();
    }
  });

  createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});