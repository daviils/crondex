export interface LogRepository {
  append(jobId: string, content: string): Promise<void>;
  list(): Promise<string[]>;
  read(jobId: string): Promise<string>;
}
