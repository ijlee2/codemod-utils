import { existsSync } from 'node:fs';
import { SHARE_ENV, Worker } from 'node:worker_threads';

export type WorkerOptions = {
  importMetaUrl: string;
  workerFilePath: string;
};

export function batchDatasets<T>(
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

export function createRunWorker<U>(
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

export function validateWorkerFilePath(workerOptions: WorkerOptions): void {
  const { importMetaUrl, workerFilePath } = workerOptions;

  const workerUrl = new URL(workerFilePath, importMetaUrl);

  if (!existsSync(workerUrl)) {
    throw new Error(
      `Worker file not found (workerFilePath: ${workerFilePath})`,
    );
  }
}
