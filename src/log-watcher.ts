import { Tail } from "tail";

export interface LogEntry {
  rid: string;
  time: string;
  ctx: string;
  msg: string;
  json: string;
}

type EntryFormatter = (json: any) => LogEntry | null;
type EntryHandler = (entry: LogEntry) => void;
type ErrorHandler = (error: any) => void;

export const watchLogFile = (
  filename: string,
  formatEntry: EntryFormatter,
  onEntry: EntryHandler,
  onError: ErrorHandler
) => {
  const tail = new Tail(filename, { fromBeginning: true, useWatchFile: true });

  tail.on("line", (data) => {
    try {
      const entry = formatEntry(JSON.parse(data));

      if (entry) {
        onEntry(entry);
      }
    } catch {
      onError({
        msg: "failed to parse line",
        line: data,
      });
    }
  });

  tail.on("error", onError);
};
