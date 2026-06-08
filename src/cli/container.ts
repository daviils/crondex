import path from 'node:path';
import { CodexExecutor } from '../executor/codex.executor.js';
import { CreateJobUseCase } from '../jobs/create-job.use-case.js';
import { DisableJobUseCase } from '../jobs/disable-job.use-case.js';
import { FileJobRepository } from '../jobs/file-job.repository.js';
import { ListJobsUseCase } from '../jobs/list-jobs.use-case.js';
import { RemoveJobUseCase } from '../jobs/remove-job.use-case.js';
import { RunJobUseCase } from '../jobs/run-job.use-case.js';
import { FileLogRepository } from '../logs/file-log.repository.js';
import { ShowLogsUseCase } from '../logs/show-logs.use-case.js';
import { SystemdScheduler } from '../scheduler/systemd.scheduler.js';
import { SystemClock } from '../utils/clock.js';
import { RandomIdGenerator } from '../utils/id.generator.js';

export interface CliContainer {
  createJobUseCase: CreateJobUseCase;
  disableJobUseCase: DisableJobUseCase;
  listJobsUseCase: ListJobsUseCase;
  removeJobUseCase: RemoveJobUseCase;
  runJobUseCase: RunJobUseCase;
  showLogsUseCase: ShowLogsUseCase;
}

export function createContainer(entrypointPath: string, cwd = process.cwd()): CliContainer {
  const clock = new SystemClock();
  const jobRepository = new FileJobRepository(path.join(cwd, 'jobs/jobs.json'));
  const logRepository = new FileLogRepository(path.join(cwd, 'logs'));
  const scheduler = new SystemdScheduler(entrypointPath, cwd);
  const executor = new CodexExecutor(cwd);

  return {
    createJobUseCase: new CreateJobUseCase(
      jobRepository,
      scheduler,
      new RandomIdGenerator(),
      clock,
    ),
    disableJobUseCase: new DisableJobUseCase(jobRepository, scheduler, clock),
    listJobsUseCase: new ListJobsUseCase(jobRepository),
    removeJobUseCase: new RemoveJobUseCase(jobRepository, scheduler),
    runJobUseCase: new RunJobUseCase(jobRepository, executor, logRepository, clock),
    showLogsUseCase: new ShowLogsUseCase(logRepository),
  };
}
