# Spiono

Spiono is a simple log viewer that parses a line-delimited file containing JSON entries. Spiono watches the log file and automatically updates as new entries are added.

![Screenshot of Spiono](/build/screenshot.png)

## Building

1: Install dependencies: `npm install`.

2: Accept my apologies if you're now running low on disk space.

3: To run a development build: `npm run dev`.

4: For full builds: `npm run build`.

## Args

If no args are given, Spiono first shows a window that allows you to select a `*.log` file.

To specify the file at runtime, pass the `--file=<path>` argument.

## Log Format

Each line of the log file must be a valid stringified JSON object.

Every log entry is passed into the [entry formatter](./src/entry-formatter.ts), which maps the keys I have in my logs to the structure Spiono expects.

To tailor it for your own logs, create a new entry formatter that parses your keys into a [LogEntry](./src/log-watcher.ts#L3) type.
