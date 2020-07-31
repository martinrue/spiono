import type { LogEntry } from "../../log-watcher";

const getColourOptions = () => {
  return [
    "#f38181",
    "#f3d569",
    "#0ea3df",
    "#10ddc2",
    "#ff8a00",
    "#ff2849",
    "#2852c5",
    "#888888",
    "#6d29a5",
    "#f25d9c",
    "#ffcd39",
    "#17b978",
    "#644f09",
  ];
};

let colourOptions = getColourOptions();

const ctxColours: any = {};

const getCtxColour = (ctx: string): string => {
  if (!ctxColours[ctx]) {
    if (colourOptions.length === 0) {
      colourOptions = getColourOptions();
    }

    ctxColours[ctx] = colourOptions.shift();
  }

  return ctxColours[ctx];
};

export const newLogComponent = ({ ctx, time, msg, json }: LogEntry, linkedToPrev = false) => {
  const colour = getCtxColour(ctx);

  const log = document.createElement("div");
  log.classList.add("log");
  log.innerHTML = `
    <div class="${linkedToPrev && "hidden"}">
      <p class="ctx" style="background:${colour}">${ctx}</p>
      <p class="t">${time}</p>
      <div class="link-bar" style="background:${colour}"></div>
    </div>

    <div>
      <p class="msg">${msg}</p>
      <p class="code">${json}</p>
    </div>`;

  return log;
};
