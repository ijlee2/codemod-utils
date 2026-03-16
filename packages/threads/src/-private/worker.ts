import { existsSync } from 'node:fs';
import { SHARE_ENV, Worker } from 'node:worker_threads';

export type WorkerOptions = {
  importMetaUrl: string;
  workerFilePath: string;
};

export function getCreateWorker<U>(
  workerOptions: WorkerOptions,
): <T>(datasets: T[]) => Promise<U[]> {
  const { importMetaUrl, workerFilePath } = workerOptions;

  function createWorker<T>(datasets: T[]): Promise<U[]> {
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

  return createWorker;
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
