import type { Scheduler } from '../scheduler/scheduler.interface.js';
import type { Clock } from '../utils/clock.js';
import type { IdGenerator } from '../utils/id.generator.js';
import type { JobRepository } from './job.repository.js';
import type { Job } from './job.type.js';

interface CreateJobInput {
  prompt: string;
  schedule: string;
}

export class CreateJobUseCase {
  constructor(
    private readonly jobRepository: JobRepository,
    private readonly scheduler: Scheduler,
    private readonly idGenerator: IdGenerator,
    private readonly clock: Clock,
  ) {}

  async execute(input: CreateJobInput): Promise<Job> {
    const now = this.clock.now();
    const job: Job = {
      id: this.idGenerator.generate(),
      prompt: input.prompt,
      schedule: input.schedule,
      status: 'enabled',
      createdAt: now,
      updatedAt: now,
    };

    await this.jobRepository.create(job);

    try {
      await this.scheduler.create(job.id, job.schedule);
      return job;
    } catch (error) {
      await this.jobRepository.remove(job.id);
      throw error;
    }
  }
}
