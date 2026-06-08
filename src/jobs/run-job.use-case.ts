import type { Executor } from '../executor/executor.interface.js';
import { formatLogEntry } from '../logs/log.formatter.js';
import type { LogRepository } from '../logs/log.repository.js';
import type { Clock } from '../utils/clock.js';
import type { JobRepository } from './job.repository.js';

export class RunJobUseCase {
  constructor(
    private readonly jobRepository: JobRepository,
    private readonly executor: Executor,
    private readonly logRepository: LogRepository,
    private readonly clock: Clock,
  ) {}

  async execute(jobId: string): Promise<void> {
    const job = await this.jobRepository.findById(jobId);

    if (!job) {
      throw new Error(`Job not found: ${jobId}`);
    }

    if (job.status === 'disabled') {
      throw new Error(`Job disabled: ${jobId}`);
    }

    await this.logRepository.append(job.id, formatLogEntry(this.clock.now(), 'START'));

    const result = await this.executor.execute(job.prompt);
    const durationMs = result.finishedAt.getTime() - result.startedAt.getTime();

    if (result.status === 'success') {
      await this.logRepository.append(
        job.id,
        formatLogEntry(result.finishedAt, 'SUCCESS', `durationMs=${durationMs}`),
      );
      return;
    }

    await this.logRepository.append(
      job.id,
      formatLogEntry(
        result.finishedAt,
        'ERROR',
        `${result.error ?? 'Unknown error'}\ndurationMs=${durationMs}`,
      ),
    );

    throw new Error(result.error ?? 'Failed to execute job.');
  }
}
