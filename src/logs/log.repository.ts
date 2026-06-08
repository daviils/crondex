export interface LogRepository {
  append(jobId: string, content: string): Promise<void>;
  read(jobId: string): Promise<string>;
}
