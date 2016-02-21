'use strict';
const electron = require('electron');
const app = electron.app;  // Module to control application life.
const BrowserWindow = electron.BrowserWindow;  // Module to create native browser window.
const Menu = require('menu');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.

// Quit when all windows are closed.
app.on('window-all-closed', function() {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform != 'darwin') {
    app.quit();
  }
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on('ready', function() {
  Menu.setApplicationMenu(menu);
  // Create the browser window.
  var mainWindow = new BrowserWindow({width: 800, height: 600});

  // and load the index.html of the app.
  mainWindow.loadURL('file://' + __dirname + '/dist/index.html');

  // Open the DevTools.
  //mainWindow.webContents.openDevTools();

  // Emitted when the window is closed.
  mainWindow.on('closed', function() {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });
});

var template = [
  {
    label: "Edit",
    submenu: [
      {
        label: "Copy",
        accelerator: "CmdOrCtrl+C",
        role: "copy",
      },
      {
        label: "Paste",
        accelerator: "CmdOrCtrl+V",
        role: "paste",
      },
      {
        label: "Cut",
        accelerator: "CmdOrCtrl+X",
        role: "cut",
      },
      {
        label: "Select All",
        accelerator: "CmdOrCtrl+A",
        role: "selectall",
      }
    ]
  }
];

var menu = Menu.buildFromTemplate(template);

