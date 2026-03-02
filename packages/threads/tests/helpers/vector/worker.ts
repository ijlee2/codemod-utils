import { parentPort, workerData } from 'node:worker_threads';

import { runTask } from '../../../src/index.js';
import { type Dataset, task } from './index.js';

type WorkerData = {
  datasets: Dataset[];
};

const WORKER_ID = `CODEMOD_UTILS_THREADS_VECTOR_${Math.random().toString(16).slice(2)}`;

const { datasets } = workerData as WorkerData;

runTask(task, datasets)
  .then((results) => {
    process.env[WORKER_ID] = `${performance.now()}`;

    parentPort?.postMessage(results);
  })
  .catch((error) => {
    throw error;
  });
