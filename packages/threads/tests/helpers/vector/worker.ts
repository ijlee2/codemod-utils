import { parentPort, workerData } from 'node:worker_threads';

import { runTask } from '../../../src/index.js';
import { task } from './setup.js';

type WorkerData = {
  datasets: Parameters<typeof task>[];
};

const { datasets } = workerData as WorkerData;

runTask(task, datasets)
  .then((result) => {
    parentPort?.postMessage(result);
  })
  .catch((error) => {
    throw error;
  });
