import { existsSync } from "fs";
import { app, ipcMain, BrowserWindow } from "electron";

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
