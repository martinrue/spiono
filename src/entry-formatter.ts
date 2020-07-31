import { inspect } from "util";
import moment from "moment";
import type { LogEntry } from "./log-watcher";

export const createEntryFormatter = (maxAgeMins = 60) => {
  return (json: any): LogEntry | null => {
    const time = moment(json.t);

    if (moment().diff(time, "minutes") >= maxAgeMins) {
      return null;
    }

    const entry = {
      rid: json.rid,
      time: time.format("ddd HH:mm"),
      ctx: json.ctx,
      msg: json.msg,
      json: "",
    };

    delete json.rid;
    delete json.ctx;
    delete json.t;
    delete json.msg;

    entry.json = inspect(json);
    return entry;
  };
};
