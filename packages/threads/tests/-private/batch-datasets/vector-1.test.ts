import { assert, test } from '@codemod-utils/tests';

import { batchDatasets } from '../../../src/-private/index.js';
import { getDatasets } from '../../helpers/vector/setup.js';

const MAX_NUM_TASKS_RUNNING = 100;

test('-private | batch-datasets > vector (1)', function () {
  const numTasks = 0;
  const datasets = getDatasets(numTasks);

  const [datasetsForMainThread, datasetsForWorkerThreads] = batchDatasets(
    datasets,
    MAX_NUM_TASKS_RUNNING,
  );

  assert.strictEqual(datasetsForMainThread.length, 0);
  assert.strictEqual(datasetsForWorkerThreads.length, 0);
});
