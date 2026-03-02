import { availableParallelism } from 'node:os';
import { SHARE_ENV, Worker } from 'node:worker_threads';

import { runTask, type Task } from './run-task.js';

const MIN_NUM_TASKS_PER_WORKER = 100;

type WorkerOptions = {
  importMetaUrl: string;
  workerFilePath: string;
};

function batchDatasets<T>(
  datasets: T[],
  numTasksPerWorker: number,
): [T[], T[][]] {
  const numTasks = datasets.length;
  const datasetsForWorkerThreads: T[][] = [];

  for (let i = 0; i < numTasks; i += numTasksPerWorker) {
    datasetsForWorkerThreads.push(datasets.slice(i, i + numTasksPerWorker));
  }

  const datasetsForMainThread: T[] = datasetsForWorkerThreads.shift() ?? [];

  return [datasetsForMainThread, datasetsForWorkerThreads];
}

function createRunWorker<U>(
  workerOptions: WorkerOptions,
): <T>(datasets: T[]) => Promise<U[]> {
  const { importMetaUrl, workerFilePath } = workerOptions;

  function runWorker<T>(datasets: T[]): Promise<U[]> {
    return new Promise((resolve, reject) => {
      const workerUrl = new URL(workerFilePath, importMetaUrl);

      const worker = new Worker(workerUrl, {
        env: SHARE_ENV,
        workerData: {
          datasets,
        },
      });

      worker.on('message', resolve);
      worker.on('error', reject);
      worker.on('exit', (code) => {
        if (code !== 0) {
          reject(new Error(`Worker stopped with exit code ${code}`));
        }
      });
    });
  }

  return runWorker;
}

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
