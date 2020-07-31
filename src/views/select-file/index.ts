import { ipcRenderer, remote } from "electron";
import { onReady, $ } from "../../helpers";

onReady(() => {
  $(".select-file .button")?.addEventListener("click", () => {
    const paths = remote.dialog.showOpenDialogSync({
      properties: ["openFile"],
      filters: [{ name: "Log Files", extensions: ["*.log"] }],
    });

    if (paths?.length !== 1) {
      return;
    }

    ipcRenderer.send("render:view-logs", { logFile: paths[0] });
  });
});
