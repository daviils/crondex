import fs from 'fs-extra';
import path from 'node:path';
import type { JobRepository } from './job.repository.js';
import type { Job } from './job.type.js';

interface StoredJob extends Omit<Job, 'createdAt' | 'updatedAt'> {
  createdAt: string;
  updatedAt: string;
}

export class FileJobRepository implements JobRepository {
  constructor(private readonly filePath: string) {}

  async create(job: Job): Promise<void> {
    const jobs = await this.readJobs();
    jobs.push(job);
    await this.writeJobs(jobs);
  }

  async findById(jobId: string): Promise<Job | null> {
    const jobs = await this.readJobs();
    return jobs.find((job) => job.id === jobId) ?? null;
  }

  async list(): Promise<Job[]> {
    return this.readJobs();
  }

  async update(job: Job): Promise<void> {
    const jobs = await this.readJobs();
    const index = jobs.findIndex((currentJob) => currentJob.id === job.id);

    if (index === -1) {
      throw new Error(`Job não encontrado: ${job.id}`);
    }

    jobs[index] = job;
    await this.writeJobs(jobs);
  }

  async remove(jobId: string): Promise<void> {
    const jobs = await this.readJobs();
    await this.writeJobs(jobs.filter((job) => job.id !== jobId));
  }

  private async readJobs(): Promise<Job[]> {
    const exists = await fs.pathExists(this.filePath);

    if (!exists) {
      return [];
    }

    const storedJobs = await fs.readJson(this.filePath);

    if (!Array.isArray(storedJobs)) {
      throw new Error(`Arquivo de jobs inválido: ${this.filePath}`);
    }

    return storedJobs.map((job: StoredJob) => ({
      ...job,
      createdAt: new Date(job.createdAt),
      updatedAt: new Date(job.updatedAt),
    }));
  }

  private async writeJobs(jobs: Job[]): Promise<void> {
    await fs.ensureDir(path.dirname(this.filePath));
    await fs.writeJson(
      this.filePath,
      jobs.map((job) => ({
        ...job,
        createdAt: job.createdAt.toISOString(),
        updatedAt: job.updatedAt.toISOString(),
      })),
      { spaces: 2 },
    );
  }
}
