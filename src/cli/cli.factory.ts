import { Command } from 'commander';
import type { CliContainer } from './container.js';
import type { Job } from '../jobs/job.type.js';

export function createCli(container: CliContainer): Command {
  const program = new Command();

  program
    .name('crondex')
    .description('Turns prompts into scheduled tasks.')
    .version('0.1.0');

  program
    .command('exec')
    .description('Creates a scheduled task from a prompt.')
    .argument('<prompt>', 'Prompt to execute.')
    .requiredOption('--schedule <schedule>', 'Task execution time.')
    .action(async (prompt: string, options: { schedule: string }) => {
      const job = await container.createJobUseCase.execute({
        prompt,
        schedule: options.schedule,
      });

      console.log(`Job created: ${job.id}`);
      console.log(`Schedule: ${job.schedule}`);
    });

  program
    .command('run')
    .description('Runs an existing task.')
    .argument('<jobId>', 'Task identifier.')
    .action(async (jobId: string) => {
      console.log(`Running job: ${jobId}`);
      await container.runJobUseCase.execute(jobId);
      console.log(`Job executed: ${jobId}`);
    });

  program
    .command('list')
    .description('Lists registered tasks.')
    .action(async () => {
      const jobs = await container.listJobsUseCase.execute();

      if (jobs.length === 0) {
        console.log('No jobs found.');
        return;
      }

      console.log(formatJobs(jobs));
    });

  program
    .command('logs')
    .description('Shows execution logs.')
    .argument('[jobId]', 'Optional task identifier.')
    .action(async (jobId?: string) => {
      const output = await container.showLogsUseCase.execute(jobId);

      if (output.jobId) {
        if (!output.content) {
          console.log(`No logs found for job: ${output.jobId}`);
          return;
        }

        console.log(output.content.trimEnd());
        return;
      }

      if (output.availableJobIds.length === 0) {
        console.log('No logs found.');
        return;
      }

      console.log(formatLogList(output.availableJobIds));
    });

  program
    .command('disable')
    .description('Disables a scheduled task.')
    .argument('<jobId>', 'Task identifier.')
    .action(async (jobId: string) => {
      await container.disableJobUseCase.execute(jobId);
      console.log(`Job disabled: ${jobId}`);
    });

  program
    .command('remove')
    .description('Removes a scheduled task.')
    .argument('<jobId>', 'Task identifier.')
    .action(async (jobId: string) => {
      await container.removeJobUseCase.execute(jobId);
      console.log(`Job removed: ${jobId}`);
    });

  return program;
}

function formatJobs(jobs: Job[]): string {
  const rows = jobs.map((job) => [
    job.id,
    job.status,
    job.schedule,
    job.createdAt.toISOString(),
    job.prompt,
  ]);

  return formatTable(['ID', 'STATUS', 'SCHEDULE', 'CREATED_AT', 'PROMPT'], rows);
}

function formatLogList(jobIds: string[]): string {
  return formatTable(['JOB_ID'], jobIds.map((jobId) => [jobId]));
}

function formatTable(headers: string[], rows: string[][]): string {
  const columnWidths = headers.map((header, index) =>
    Math.max(header.length, ...rows.map((row) => row[index].length)),
  );

  const lines = [
    formatRow(headers, columnWidths),
    formatRow(columnWidths.map((width) => '-'.repeat(width)), columnWidths),
    ...rows.map((row) => formatRow(row, columnWidths)),
  ];

  return lines.join('\n');
}

function formatRow(values: string[], columnWidths: number[]): string {
  return values.map((value, index) => value.padEnd(columnWidths[index])).join('  ');
}
