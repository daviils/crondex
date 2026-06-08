import { Command } from 'commander';
import type { CliContainer } from './container.js';

export function createCli(container: CliContainer): Command {
  const program = new Command();

  program
    .name('crondex')
    .description('Transforma prompts em tarefas agendadas.')
    .version('0.1.0');

  program
    .command('exec')
    .description('Cria uma tarefa agendada a partir de um prompt.')
    .argument('<prompt>', 'Prompt que será executado.')
    .requiredOption('--schedule <schedule>', 'Horário de execução da tarefa.')
    .action(async (prompt: string, options: { schedule: string }) => {
      const job = await container.createJobUseCase.execute({
        prompt,
        schedule: options.schedule,
      });

      console.log(`Job criado: ${job.id}`);
      console.log(`Agendamento: ${job.schedule}`);
    });

  program
    .command('run')
    .description('Executa uma tarefa existente.')
    .argument('<jobId>', 'Identificador da tarefa.')
    .action(async (jobId: string) => {
      await container.runJobUseCase.execute(jobId);
      console.log(`Job executado: ${jobId}`);
    });

  program
    .command('list')
    .description('Lista tarefas cadastradas.')
    .action(() => {
      throw new Error('Comando ainda não implementado.');
    });

  program
    .command('logs')
    .description('Exibe logs de execução.')
    .argument('[jobId]', 'Identificador opcional da tarefa.')
    .action(() => {
      throw new Error('Comando ainda não implementado.');
    });

  program
    .command('disable')
    .description('Desativa uma tarefa agendada.')
    .argument('<jobId>', 'Identificador da tarefa.')
    .action(() => {
      throw new Error('Comando ainda não implementado.');
    });

  program
    .command('remove')
    .description('Remove uma tarefa agendada.')
    .argument('<jobId>', 'Identificador da tarefa.')
    .action(() => {
      throw new Error('Comando ainda não implementado.');
    });

  return program;
}
