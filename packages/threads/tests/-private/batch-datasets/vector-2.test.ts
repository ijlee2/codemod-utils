import { assert, test } from '@codemod-utils/tests';

import { batchDatasets } from '../../../src/-private/index.js';
import { getDatasets } from '../../helpers/vector/setup.js';

const MAX_NUM_TASKS_RUNNING = 100;

test('-private | batch-datasets > vector (2)', function () {
  const numTasks = MAX_NUM_TASKS_RUNNING - 1;
  const datasets = getDatasets(numTasks);

  const [datasetsForMainThread, datasetsForWorkerThreads] = batchDatasets(
    datasets,
    MAX_NUM_TASKS_RUNNING,
  );

  assert.strictEqual(datasetsForMainThread.length, 99);
  assert.strictEqual(datasetsForWorkerThreads.length, 0);
});
