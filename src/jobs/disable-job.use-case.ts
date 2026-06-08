import type { Scheduler } from '../scheduler/scheduler.interface.js';
import type { Clock } from '../utils/clock.js';
import type { JobRepository } from './job.repository.js';

export class DisableJobUseCase {
  constructor(
    private readonly jobRepository: JobRepository,
    private readonly scheduler: Scheduler,
    private readonly clock: Clock,
  ) {}

  async execute(jobId: string): Promise<void> {
    const job = await this.jobRepository.findById(jobId);

    if (!job) {
      throw new Error(`Job not found: ${jobId}`);
    }

    await this.scheduler.disable(job.id);
    await this.jobRepository.update({
      ...job,
      status: 'disabled',
      updatedAt: this.clock.now(),
    });
  }
}
