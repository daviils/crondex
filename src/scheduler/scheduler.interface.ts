export interface Scheduler {
  create(jobId: string, schedule: string): Promise<void>;
  remove(jobId: string): Promise<void>;
  enable(jobId: string): Promise<void>;
  disable(jobId: string): Promise<void>;
}
