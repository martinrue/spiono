import { parse } from "querystring";
import { ipcRenderer } from "electron";
import { onReady, $ } from "../../helpers";
import { watchLogFile, LogEntry } from "../../log-watcher";
import { createEntryFormatter } from "../../entry-formatter";
import { newChartComponent } from "./chart-component";
import { newLogComponent } from "./log-component";

const state = {
  scrollLocked: false,
  lastRid: "",
  totalEvents: 0,
  lastEvent: "-",
  chart: newChartComponent(),
};

const updateScrollButtonVisibility = () => {
  $(".scroll-bottom-button").style.display = state.scrollLocked ? "block" : "none";
};

const updateStats = () => {
  $("#total-events").innerText = `${state.totalEvents}`;
  $("#last-event").innerText = `${state.lastEvent}`;
};

const scrollBottom = (smooth = true) => {
  window.scrollTo({ left: 0, top: document.body.scrollHeight, behavior: smooth ? "smooth" : "auto" });
};

const onEntry = (entry: LogEntry) => {
  state.totalEvents += 1;
  state.lastEvent = entry.time;

  const linkedToPrev = !!entry.rid && entry.rid === state.lastRid;
  $(".logs").appendChild(newLogComponent(entry, linkedToPrev));
  state.lastRid = entry.rid;

  if (!state.scrollLocked) {
    scrollBottom(false);
  }

  updateStats();
  state.chart.addToTimeSeries1m(entry);
  state.chart.renderChart();
};

ipcRenderer.on("clear-logs", () => {
  $(".logs").innerHTML = "";
  state.scrollLocked = false;
  updateScrollButtonVisibility();
});

onReady(() => {
  state.chart.setDestination($("#activity-chart") as HTMLCanvasElement);

  window.addEventListener("scroll", () => {
    state.scrollLocked = window.innerHeight + window.scrollY < document.documentElement.scrollHeight;
    updateScrollButtonVisibility();
  });

  $(".scroll-bottom-button").addEventListener("click", () => {
    scrollBottom(true);
    updateScrollButtonVisibility();
  });

  const logFile: any = parse(global.location.search)["?logFile"];
  const formatter = createEntryFormatter(60 * 24);

  watchLogFile(logFile, formatter, onEntry, (err) => console.error(err));
});
