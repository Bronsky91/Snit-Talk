// Modules to control application life and create native browser window
const {
  app,
  BrowserWindow,
  globalShortcut,
  ipcMain,
} = require("electron");
const py = require("child_process");
const { dialog } = require('electron')

function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 400,
    height: 400,
    webPreferences: {
      nodeIntegration: true
    }
  });

  // and load the index.html of the app.
  mainWindow.loadFile("index.html");

  // Open the DevTools.
  //mainWindow.webContents.openDevTools();
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(createWindow);

// Quit when all windows are closed.
app.on("window-all-closed", function () {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== "darwin") app.quit();
});

app.on("activate", function () {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

let currentPackage = {};
let usedSnits = [];
ipcMain.on("setPackage", (event, package) => {
  currentPackage = package;
  usedSnits = [];
});

let snitOn = true;
ipcMain.on("snitCheck", (event, snit) => {
  snitOn = snit;
});

var lastHotkeys = [];
ipcMain.on("hotKeyUpdate", (event, keys) => {
  console.log(keys)
  if(lastHotkeys.length > 0){
    globalShortcut.unregister(lastHotkeys.join('+'))
  }
  globalShortcut.register(keys.join('+'), () => {
    if (snitOn) {
      let snit = random_snit(currentPackage.snitList)
      console.log(snit)
      let keyboardScript = py.spawn("python", ["./type.py", snit]);
      keyboardScript.on('close', (code) => {
        console.log(`child process exited with code ${code}`);
      });
    } else {
      console.log("not on");
    }
  });
  lastHotkeys = keys;
});

ipcMain.on('alert', (event, options) => {
  dialog.showMessageBoxSync(options);
});

ipcMain.on("hotKeySetup", (event, setup) => {
  if (BrowserWindow.getAllWindows().length < 2) {
    const hotkeyWindow = new BrowserWindow({
      width: 500,
      height: 300,
      webPreferences: {
        nodeIntegration: true
      }
    });
    hotkeyWindow.loadFile("hotkey-setup.html");
    // Open the DevTools.
    //hotkeyWindow.webContents.openDevTools();
  };
});

app.whenReady().then(() => {
  // py.spawn("python", ["./install.py", snit]);

  globalShortcut.register("Alt+S+N+I+T", () => {
    // Create the browser window.
    if (BrowserWindow.getAllWindows().length < 2) {
      const adminWindow = new BrowserWindow({
        width: 500,
        height: 300,
        webPreferences: {
          nodeIntegration: true
        }
      });
      adminWindow.loadFile("admin.html");
      // Open the DevTools.
      adminWindow.webContents.openDevTools();
    };
  });

});

function random_snit(snitList) {
  if (usedSnits.length == snitList.length) {
    usedSnits = [];
  }
  let newSnit = snitList[Math.floor(Math.random() * snitList.length)].snit
  if (!usedSnits.includes(newSnit)) {
    usedSnits.push(newSnit);
    return newSnit;
  }
  return random_snit(snitList);
}
