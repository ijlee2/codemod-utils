import { availableParallelism } from 'node:os';

import {
  batchDatasets,
  getCreateWorker,
  validateWorkerFilePath,
  type WorkerOptions,
} from './-private/parallelize.js';
import { runTask, type Task } from './-private/run-task.js';

const MIN_NUM_TASKS_PER_WORKER = 100;

/**
 * Runs a task on many datasets in parallel. The size of datasets can be
 * arbitrarily large (subject to available resources).
 *
 * @param task
 *
 * Some function to call.
 *
 * @param datasets
 *
 * An array of dataset's.
 *
 * @param workerOptions
 *
 * An object to help locate the worker file. The worker file is used when the
 * problem size is large enough.
 *
 * The value of `importMetaUrl` is always `import.meta.url`. For `workerFilePath`,
 * pass the relative path to the worker file.
 *
 * @return
 *
 * An array of the task's return value.
 *
 * @example
 *
 * Analyze files in parallel.
 *
 * ```ts
 * // src/steps/analyze-files.ts
 * import { parallelize } from '@codemod-utils/threads';
 *
 * import type { Options } from '../types/index.js';
 * import { task } from './analyze-files/task.js';
 *
 * export async function analyzeFiles(options: Options): Promise<void> {
 *   const { projectRoot } = options;
 *
 *   const datasets: Parameters<typeof task>[] = [
 *     ['LICENSE.md', projectRoot],
 *     ['README.md', projectRoot],
 *   ];
 *
 *   const results = await parallelize(task, datasets, {
 *     importMetaUrl: import.meta.url,
 *     workerFilePath: './analyze-files/worker.js',
 *   });
 *
 *   // ...
 * }
 * ```
 *
 * ```ts
 * // src/steps/analyze-files/task.ts
 * export function task(filePath: string, projectRoot: string): Result {
 *   // ...
 * }
 * ```
 *
 * ```ts
 * // src/steps/analyze-files/worker.ts
 * import { runWorker } from '@codemod-utils/threads';
 *
 * import { task } from './task.js';
 *
 * runWorker(task);
 * ```
 */
export async function parallelize<T extends unknown[], U>(
  task: Task<T, U>,
  datasets: T[],
  workerOptions: WorkerOptions,
): Promise<U[]> {
  validateWorkerFilePath(workerOptions);

  const numTasks = datasets.length;

  if (numTasks < MIN_NUM_TASKS_PER_WORKER) {
    return await runTask(task, datasets);
  }

  const numWorkers = availableParallelism();

  const numTasksPerWorker = Math.max(
    Math.ceil(numTasks / numWorkers),
    MIN_NUM_TASKS_PER_WORKER,
  );

  const [datasetsForMainThread, datasetsForWorkerThreads] = batchDatasets(
    datasets,
    numTasksPerWorker,
  );

  const createWorker = getCreateWorker<U>(workerOptions);

  const [mainThreadResults, ...workerResults] = await Promise.all([
    runTask(task, datasetsForMainThread),
    ...datasetsForWorkerThreads.map(createWorker),
  ]);

  return [...mainThreadResults, ...workerResults.flat()];
}
