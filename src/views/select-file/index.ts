import { ipcRenderer } from "electron";
import { onReady, $ } from "../../helpers";

onReady(() => {
  $(".select-file .button")?.addEventListener("click", async () => {
    const path = await ipcRenderer.invoke("select-log-file");

    if (path) {
      ipcRenderer.send("render:view-logs", { logFile: path });
    }
  });
});
