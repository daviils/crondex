import { execa } from 'execa';
import fs from 'node:fs';
import path from 'node:path';
import type { Executor } from './executor.interface.js';
import type { ExecutionResult } from './execution-result.type.js';

export class CodexExecutor implements Executor {
  constructor(
    private readonly workingDirectory = process.cwd(),
    private readonly codexBinaryPath = resolveCodexBinaryPath(),
    private readonly nodeBinaryDirectory = path.dirname(process.execPath),
  ) {}

  async execute(prompt: string): Promise<ExecutionResult> {
    const startedAt = new Date();

    try {
      const result = await execa(this.codexBinaryPath, [
        'exec',
        '--cd',
        this.workingDirectory,
        '--sandbox',
        'workspace-write',
        prompt,
      ], {
        env: {
          PATH: buildPathWithNode(this.nodeBinaryDirectory),
        },
        stdin: 'ignore',
      });
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

function buildPathWithNode(nodeBinaryDirectory: string): string {
  return [nodeBinaryDirectory, process.env.PATH].filter(Boolean).join(path.delimiter);
}

function resolveCodexBinaryPath(): string {
  const siblingBinaryPath = path.join(path.dirname(process.execPath), 'codex');

  if (fs.existsSync(siblingBinaryPath)) {
    return siblingBinaryPath;
  }

  return 'codex';
}
