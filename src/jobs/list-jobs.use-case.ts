import type { JobRepository } from './job.repository.js';
import type { Job } from './job.type.js';

export class ListJobsUseCase {
  constructor(private readonly jobRepository: JobRepository) {}

  async execute(): Promise<Job[]> {
    const jobs = await this.jobRepository.list();

    return jobs.sort((left, right) => left.createdAt.getTime() - right.createdAt.getTime());
  }
}
