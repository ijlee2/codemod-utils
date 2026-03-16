import { assert, test } from '@codemod-utils/tests';

import { batchDatasets } from '../../../src/-private/index.js';
import { getDatasets } from '../../helpers/vector/setup.js';

const MAX_NUM_TASKS_RUNNING = 100;

test('-private | batch-datasets > vector (5)', function () {
  const numTasks = 3 * MAX_NUM_TASKS_RUNNING;
  const datasets = getDatasets(numTasks);

  const [datasetsForMainThread, datasetsForWorkerThreads] = batchDatasets(
    datasets,
    MAX_NUM_TASKS_RUNNING,
  );

  assert.strictEqual(datasetsForMainThread.length, 100);
  assert.strictEqual(datasetsForWorkerThreads.length, 2);

  assert.strictEqual(datasetsForWorkerThreads[0]!.length, 100);
  assert.strictEqual(datasetsForWorkerThreads[1]!.length, 100);
});
