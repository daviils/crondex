import type { Job } from './job.type.js';

export interface JobRepository {
  create(job: Job): Promise<void>;
  findById(jobId: string): Promise<Job | null>;
  list(): Promise<Job[]>;
  update(job: Job): Promise<void>;
  remove(jobId: string): Promise<void>;
}
