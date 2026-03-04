import { availableParallelism } from 'node:os';

import {
  batchDatasets,
  createRunWorker,
  type WorkerOptions,
} from './-private/parallelize.js';
import { runTask, type Task } from './run-task.js';

const MIN_NUM_TASKS_PER_WORKER = 100;

export async function parallelize<T extends unknown[], U>(
  task: Task<T, U>,
  datasets: T[],
  workerOptions: WorkerOptions,
): Promise<U[]> {
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

  const runWorker = createRunWorker<U>(workerOptions);

  const [mainThreadResults, ...workerResults] = await Promise.all([
    runTask(task, datasetsForMainThread),
    ...datasetsForWorkerThreads.map(runWorker),
  ]);

  return [...mainThreadResults, ...workerResults.flat()];
}
