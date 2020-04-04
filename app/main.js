// Modules to control application life and create native browser window
const {
  app,
  BrowserWindow,
  globalShortcut,
  ipcMain,
  global
} = require("electron");
const py = require("child_process");

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
  mainWindow.webContents.openDevTools();
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


let snitOn = true;
ipcMain.on("snitCheck", (event, snit) => {
  snitOn = snit;
});

let currentPackage = {};
let usedSnits = [];
ipcMain.on("setPackage", (event, package) => {
  currentPackage = package;
  usedSnits = [];
});

let keys = []
ipcMain.on("hotKeyUpdate", (event, newKeys) => {
  keys = newKeys
});

ipcMain.on("hotKeySetup", (event, setup) => {
  if (BrowserWindow.getAllWindows().length < 2) {
    const adminWindow = new BrowserWindow({
      width: 500,
      height: 300,
      webPreferences: {
        nodeIntegration: true
      }
    });
    adminWindow.loadFile("hotkey-setup.html");
    // Open the DevTools.
    adminWindow.webContents.openDevTools();
  };
});

app.whenReady().then(() => {

  globalShortcut.register(keys.join('+'), () => {

  })

  globalShortcut.register("CommandOrControl+X", () => {
    if (snitOn) {
      let snit = random_snit(currentPackage.snitList)
      console.log(snit)
      py.spawn("python", ["./type.py", snit]);
    } else {
      console.log("not on");
    }
  });

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
