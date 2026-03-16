import { parentPort, workerData } from 'node:worker_threads';

import { runTask, type Task } from './-private/run-task.js';

/**
 * Runs a task on a worker.
 *
 * Note, a worker file always uses the code shown below. You just need to
 * import the task from the right file.
 *
 * @param task
 *
 * Some function to call.
 *
 * @example
 *
 * Create a worker file for a task.
 *
 * ```ts
 * import { runWorker } from '@codemod-utils/threads';
 *
 * import { task } from './task.js';
 *
 * runWorker(task);
 * ```
 */
export function runWorker<T extends unknown[], U>(task: Task<T, U>): void {
  const { datasets } = workerData as {
    datasets: T[];
  };

  runTask(task, datasets)
    .then((result) => {
      parentPort?.postMessage(result);
    })
    .catch((error) => {
      throw error;
    });
}
