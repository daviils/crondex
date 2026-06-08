export type ExecutionStatus = 'success' | 'failure';

export interface ExecutionResult {
  status: ExecutionStatus;
  output: string;
  error?: string;
  startedAt: Date;
  finishedAt: Date;
}
