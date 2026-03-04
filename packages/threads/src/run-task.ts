import { Queue } from './-private/run-task.js';

const MAX_NUM_TASKS_RUNNING = 10;

export type Task<T extends unknown[], U> = (...dataset: T) => U | Promise<U>;

export async function runTask<T extends unknown[], U>(
  task: Task<T, U>,
  datasets: T[],
): Promise<U[]> {
  const queue = new Queue<U>(MAX_NUM_TASKS_RUNNING);

  for (const dataset of datasets) {
    if (queue.hasTooManyTasks) {
      await queue.wait();
    }

    await queue.runTask(task(...dataset));
  }

  if (queue.hasTasks) {
    await queue.finishTasks();
  }

  const { output } = queue;

  if (output.status === 'failed') {
    throw output.error;
  }

  return output.results;
}
