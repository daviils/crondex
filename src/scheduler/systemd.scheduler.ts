import { execa } from 'execa';
import fs from 'fs-extra';
import os from 'node:os';
import path from 'node:path';
import type { Scheduler } from './scheduler.interface.js';
import { parseDailySchedule, toSystemdOnCalendar } from './timer.parser.js';

export class SystemdScheduler implements Scheduler {
  constructor(
    private readonly entrypointPath: string,
    private readonly systemdUserDir = path.join(os.homedir(), '.config/systemd/user'),
  ) {}

  async create(jobId: string, schedule: string): Promise<void> {
    const parsedSchedule = parseDailySchedule(schedule);

    await fs.ensureDir(this.systemdUserDir);
    await fs.writeFile(this.getServicePath(jobId), this.buildServiceFile(jobId));
    await fs.writeFile(
      this.getTimerPath(jobId),
      this.buildTimerFile(jobId, toSystemdOnCalendar(parsedSchedule)),
    );

    await execa('systemctl', ['--user', 'daemon-reload']);
    await this.enable(jobId);
  }

  async remove(jobId: string): Promise<void> {
    await this.disable(jobId);
    await fs.remove(this.getServicePath(jobId));
    await fs.remove(this.getTimerPath(jobId));
    await execa('systemctl', ['--user', 'daemon-reload']);
  }

  async enable(jobId: string): Promise<void> {
    await execa('systemctl', ['--user', 'enable', '--now', this.getTimerUnitName(jobId)]);
  }

  async disable(jobId: string): Promise<void> {
    await execa('systemctl', ['--user', 'disable', '--now', this.getTimerUnitName(jobId)]);
  }

  private buildServiceFile(jobId: string): string {
    return [
      '[Unit]',
      `Description=Crondex job ${jobId}`,
      '',
      '[Service]',
      'Type=oneshot',
      `ExecStart=${quote(process.execPath)} ${quote(this.entrypointPath)} run ${jobId}`,
      '',
    ].join('\n');
  }

  private buildTimerFile(jobId: string, onCalendar: string): string {
    return [
      '[Unit]',
      `Description=Crondex timer ${jobId}`,
      '',
      '[Timer]',
      `OnCalendar=${onCalendar}`,
      'Persistent=true',
      '',
      '[Install]',
      'WantedBy=timers.target',
      '',
    ].join('\n');
  }

  private getServicePath(jobId: string): string {
    return path.join(this.systemdUserDir, this.getServiceUnitName(jobId));
  }

  private getTimerPath(jobId: string): string {
    return path.join(this.systemdUserDir, this.getTimerUnitName(jobId));
  }

  private getServiceUnitName(jobId: string): string {
    return `crondex-${jobId}.service`;
  }

  private getTimerUnitName(jobId: string): string {
    return `crondex-${jobId}.timer`;
  }
}

function quote(value: string): string {
  return `"${value.replaceAll('\\', '\\\\').replaceAll('"', '\\"')}"`;
}
