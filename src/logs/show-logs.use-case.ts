import type { LogRepository } from './log.repository.js';

export interface ShowLogsOutput {
  jobId?: string;
  availableJobIds: string[];
  content?: string;
}

export class ShowLogsUseCase {
  constructor(private readonly logRepository: LogRepository) {}

  async execute(jobId?: string): Promise<ShowLogsOutput> {
    if (jobId) {
      return {
        jobId,
        availableJobIds: [],
        content: await this.logRepository.read(jobId),
      };
    }

    return {
      availableJobIds: await this.logRepository.list(),
    };
  }
}
