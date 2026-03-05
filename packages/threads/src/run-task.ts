import { Queue } from './-private/run-task.js';

const MAX_NUM_TASKS_RUNNING = 10;

export type Task<T extends unknown[], U> = (...dataset: T) => U | Promise<U>;

/**
 * Runs a task on many datasets. The size of datasets should be moderate.
 * Primarily used to create a worker file for a task.
 *
 * Note, a worker file always uses the code shown below. You just need to
 * import the task from the right file.
 *
 * @param task
 *
 * Some function to call.
 *
 * @param datasets
 *
 * An array of dataset's.
 *
 * @return
 *
 * An array of the task's return value.
 *
 * @example
 *
 * Create a worker file for a task.
 *
 * ```ts
 * import { parentPort, workerData } from 'node:worker_threads';
 *
 * import { runTask } from '@codemod-utils/threads';
 *
 * import { task } from './task.js';
 *
 * type WorkerData = {
 *   datasets: Parameters<typeof task>[];
 * };
 *
 * const { datasets } = workerData as WorkerData;
 *
 * runTask(task, datasets)
 *   .then((result) => {
 *     parentPort?.postMessage(result);
 *   })
 *   .catch((error) => {
 *     throw error;
 *   });
 * ```
 */
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
