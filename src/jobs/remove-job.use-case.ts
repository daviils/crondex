import type { Scheduler } from '../scheduler/scheduler.interface.js';
import type { JobRepository } from './job.repository.js';

export class RemoveJobUseCase {
  constructor(
    private readonly jobRepository: JobRepository,
    private readonly scheduler: Scheduler,
  ) {}

  async execute(jobId: string): Promise<void> {
    const job = await this.jobRepository.findById(jobId);

    if (!job) {
      throw new Error(`Job not found: ${jobId}`);
    }

    await this.scheduler.remove(job.id);
    await this.jobRepository.remove(job.id);
  }
}
