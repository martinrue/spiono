import Chart from "chart.js";
import moment from "moment";
import { debounce } from "../../helpers";
import type { LogEntry } from "../../log-watcher";

interface State {
  element?: HTMLCanvasElement;
  chart?: InstanceType<typeof Chart>;
  eventSeries1m: { [key1m: string]: number };
}

export const newChartComponent = () => {
  const state: State = {
    eventSeries1m: {},
  };

  const setDestination = (element: HTMLCanvasElement) => {
    state.element = element;
  };

  const addToTimeSeries1m = (entry: LogEntry) => {
    if (!state.eventSeries1m[entry.time]) {
      state.eventSeries1m[entry.time] = 0;
    }

    state.eventSeries1m[entry.time] += 1;
  };

  const generateSeries15m = () => {
    const now = moment();
    const labels = ["-45m", "-30m", "-15m", now.format("HH:mm")];
    const data: number[] = [];

    [...Array(4)].forEach(() => {
      let total = 0;

      [...Array(15)].forEach(() => {
        total += state.eventSeries1m[now.format("ddd HH:mm")] || 0;
        now.subtract(1, "minute");
      });

      data.unshift(total);
    });

    return { labels, data };
  };

  const renderChart = debounce(() => {
    const datasetStyles = {
      pointBackgroundColor: "#81dafc",
      borderColor: "#81dafcbb",
      backgroundColor: "#81dafc11",
    };

    const { labels, data } = generateSeries15m();

    if (!state.chart) {
      state.chart = new Chart(state.element!, {
        type: "line",
        data: {
          labels,
          datasets: [{ data, ...datasetStyles }],
        },
        options: {
          responsive: false,
          legend: { display: false },
          layout: { padding: { top: 3 } },
          tooltips: { mode: "index", intersect: false, displayColors: false },
          scales: {
            xAxes: [{ gridLines: { display: false }, ticks: { fontColor: "#aaa", fontSize: 12 } }],
            yAxes: [{ display: false, gridLines: { display: false } }],
          },
        },
      });
    } else {
      state.chart.data = {
        labels,
        datasets: [{ data, ...datasetStyles }],
      };

      state.chart.update();
    }
  });

  return { addToTimeSeries1m, setDestination, renderChart };
};
