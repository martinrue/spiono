import { existsSync } from "fs";
import { app, ipcMain, BrowserWindow, Menu } from "electron";

let window: BrowserWindow | null = null;

const showSelectLogWindow = () => {
  window!.loadFile("src/views/select-file/index.html");
};

const showLogViewerWindow = (logFile: string) => {
  window!.loadFile("src/views/view-logs/index.html", {
    query: { logFile },
  });

  window!.setResizable(true);
  window!.setMinimumSize(700, 700);
  window!.setSize(1100, 700);
  window!.center();
};

const createWindow = (logFile?: string) => {
  window = new BrowserWindow({
    width: 400,
    height: 400,
    resizable: false,
    backgroundColor: "#202020",
    webPreferences: {
      scrollBounce: true,
      nodeIntegration: true,
    },
  });

  if (logFile && existsSync(logFile)) {
    return showLogViewerWindow(logFile);
  }

  showSelectLogWindow();
};

const menu = Menu.buildFromTemplate([
  {
    label: app.name,
    submenu: [{ role: "about" }, { role: "quit" }],
  },
  {
    label: "Window",
    submenu: [
      {
        label: "Clear Logs",
        accelerator: "CmdOrCtrl+K",
        click: () => {
          window!.webContents.send("clear-logs");
        },
      },
      {
        label: "Open DevTools",
        accelerator: "CmdOrCtrl+Alt+I",
        click: () => {
          window!.webContents.openDevTools();
        },
      },
    ],
  },
] as any);

Menu.setApplicationMenu(menu);

app.whenReady().then(() => {
  createWindow(app.commandLine.getSwitchValue("file"));
});

app.on("window-all-closed", () => {
  if (process.platform === "darwin") {
    return;
  }

  app.quit();
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

ipcMain.on("render:view-logs", (_, arg) => {
  showLogViewerWindow(arg.logFile);
});
