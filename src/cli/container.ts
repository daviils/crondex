import path from 'node:path';
import { CodexExecutor } from '../executor/codex.executor.js';
import { CreateJobUseCase } from '../jobs/create-job.use-case.js';
import { FileJobRepository } from '../jobs/file-job.repository.js';
import { RunJobUseCase } from '../jobs/run-job.use-case.js';
import { FileLogRepository } from '../logs/file-log.repository.js';
import { SystemdScheduler } from '../scheduler/systemd.scheduler.js';
import { SystemClock } from '../utils/clock.js';
import { RandomIdGenerator } from '../utils/id.generator.js';

export interface CliContainer {
  createJobUseCase: CreateJobUseCase;
  runJobUseCase: RunJobUseCase;
}

export function createContainer(entrypointPath: string, cwd = process.cwd()): CliContainer {
  const clock = new SystemClock();
  const jobRepository = new FileJobRepository(path.join(cwd, 'jobs/jobs.json'));
  const logRepository = new FileLogRepository(path.join(cwd, 'logs'));
  const scheduler = new SystemdScheduler(entrypointPath);
  const executor = new CodexExecutor();

  return {
    createJobUseCase: new CreateJobUseCase(
      jobRepository,
      scheduler,
      new RandomIdGenerator(),
      clock,
    ),
    runJobUseCase: new RunJobUseCase(jobRepository, executor, logRepository, clock),
  };
}
