import { execa } from 'execa';
import type { Executor } from './executor.interface.js';
import type { ExecutionResult } from './execution-result.type.js';

export class CodexExecutor implements Executor {
  async execute(prompt: string): Promise<ExecutionResult> {
    const startedAt = new Date();

    try {
      const result = await execa('codex', [prompt]);
      const finishedAt = new Date();

      return {
        status: 'success',
        output: result.stdout,
        startedAt,
        finishedAt,
      };
    } catch (error) {
      const finishedAt = new Date();

      return {
        status: 'failure',
        output: '',
        error: error instanceof Error ? error.message : String(error),
        startedAt,
        finishedAt,
      };
    }
  }
}
