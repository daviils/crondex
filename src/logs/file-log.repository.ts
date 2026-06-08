import fs from 'fs-extra';
import path from 'node:path';
import type { LogRepository } from './log.repository.js';

export class FileLogRepository implements LogRepository {
  constructor(private readonly logsDir: string) {}

  async append(jobId: string, content: string): Promise<void> {
    await fs.ensureDir(this.logsDir);
    await fs.appendFile(this.getLogPath(jobId), content);
  }

  async list(): Promise<string[]> {
    const exists = await fs.pathExists(this.logsDir);

    if (!exists) {
      return [];
    }

    const entries = await fs.readdir(this.logsDir);

    return entries
      .filter((entry) => entry.endsWith('.log'))
      .map((entry) => path.basename(entry, '.log'))
      .sort();
  }

  async read(jobId: string): Promise<string> {
    const logPath = this.getLogPath(jobId);
    const exists = await fs.pathExists(logPath);

    if (!exists) {
      return '';
    }

    return fs.readFile(logPath, 'utf8');
  }

  private getLogPath(jobId: string): string {
    return path.join(this.logsDir, `${jobId}.log`);
  }
}
