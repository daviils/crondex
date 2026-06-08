export type JobStatus = 'enabled' | 'disabled';

export interface Job {
  id: string;
  prompt: string;
  schedule: string;
  status: JobStatus;
  createdAt: Date;
  updatedAt: Date;
}
