import type { ExecutionResult } from './execution-result.type.js';

export interface Executor {
  execute(prompt: string): Promise<ExecutionResult>;
}
