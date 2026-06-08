# Crondex

Linux CLI that turns prompts into scheduled tasks using `systemd --user`.

Example:

```bash
crondex exec "search for AI news" --schedule="23:30"
```

## Project Status

Available flows:

- `crondex exec`: creates a job, stores it in `jobs/jobs.json`, and registers a systemd timer.
- `crondex run`: runs an existing job using `codex "<prompt>"` and writes execution logs.
- `crondex list`: lists registered jobs.
- `crondex logs`: lists available logs or shows logs for a job.
- `crondex disable`: disables a job and stops its systemd timer.
- `crondex remove`: removes a job and its systemd timer/service files.

## Requirements

- Linux
- Node.js LTS
- npm
- systemd with user services support (`systemctl --user`)
- Codex CLI installed and available in the terminal as `codex`

Check your environment:

```bash
node --version
npm --version
systemctl --user status
codex --help
```

## Installation

Clone the repository:

```bash
git clone <repository-url>
cd crondex
```

Install dependencies and build the project:

```bash
npm install
npm run build
```

Make the `crondex` command available in your terminal:

```bash
npm link
```

Confirm it is available:

```bash
crondex --help
```

## Usage

Create a scheduled job:

```bash
crondex exec "search for AI news" --schedule="23:30"
```

The command returns:

```txt
Job created: <jobId>
Schedule: 23:30
```

Run a job manually:

```bash
crondex run "<jobId>"
```

List registered jobs:

```bash
crondex list
```

List available logs:

```bash
crondex logs
```

Show logs for a job:

```bash
crondex logs "<jobId>"
```

Disable a scheduled job:

```bash
crondex disable "<jobId>"
```

Remove a scheduled job:

```bash
crondex remove "<jobId>"
```

## Schedule Format

Use the `HH:mm` format with a 24-hour clock.

Examples:

```bash
--schedule="08:00"
--schedule="14:30"
--schedule="23:59"
```

## Generated Files

Crondex stores data only in files.

In the directory where the command is executed:

```txt
jobs/jobs.json
logs/<jobId>.log
```

In the user systemd directory:

```txt
~/.config/systemd/user/crondex-<jobId>.service
~/.config/systemd/user/crondex-<jobId>.timer
```

## Checking Timers

List Crondex timers:

```bash
systemctl --user list-timers "crondex-*"
```

Check a timer status:

```bash
systemctl --user status "crondex-<jobId>.timer"
```

Check a service status:

```bash
systemctl --user status "crondex-<jobId>.service"
```

## Logs

Use the CLI:

```bash
crondex logs "<jobId>"
```

Or read the log file directly:

```bash
cat logs/<jobId>.log
```

Expected format:

```txt
[2026-06-08 23:30:02]
START

[2026-06-08 23:30:15]
SUCCESS

durationMs=13000
```

## Updating After Code Changes

Whenever TypeScript code changes:

```bash
npm run build
```

If the project is already linked with `npm link`, you do not need to link it again.

## Removing the Global Command

```bash
npm unlink -g crondex
```

## Development

Main structure:

```txt
src/
 ├── cli/
 ├── scheduler/
 ├── executor/
 ├── jobs/
 ├── logs/
 ├── utils/
 └── main.ts
```

Scripts:

```bash
npm run build
npm test
```

## License

Crondex is licensed under GPL-3.0.

You are free to use, modify and distribute this software.
If you distribute modified versions, you must also provide the source code.
