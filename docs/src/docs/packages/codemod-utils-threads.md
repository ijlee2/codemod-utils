# @codemod-utils/threads

_Utilities for parallelization_


## What is it?

`@codemod-utils/threads` provides methods that help you parallelize code.


## API

In the context of `@codemod-utils/threads`, a **task** is simply a function. A **dataset** refers to the task's positional arguments.


### parallelize {#api-parallelize}

Runs a task on many datasets in parallel. The size of datasets can be arbitrarily large (subject to available resources).

::: code-group

```ts [Signature]
/**
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
 */
type Task<T extends unknown[], U> = (...dataset: T) => U | Promise<U>;

type WorkerOptions = {
  importMetaUrl: string;
  workerFilePath: string;
};

function parallelize<T extends unknown[], U>(
  task: Task<T, U>,
  datasets: T[],
  workerOptions: WorkerOptions,
): Promise<U[]>;
```

```ts [Example (src/steps/analyze-files.ts)]{12-15}
import type { Options } from '../types/index.js';
import { task } from './analyze-files/task.js';

export async function analyzeFiles(options: Options): Promise<void> {
  const { projectRoot } = options;

  const datasets: Parameters<typeof task>[] = [
    ['LICENSE.md', projectRoot],
    ['README.md', projectRoot],
  ];

  const results = await parallelize(task, datasets, {
    importMetaUrl: import.meta.url,
    workerFilePath: './analyze-files/worker.js',
  });

  // ...
}
```

```ts [Example (src/steps/analyze-files/task.ts)]
export function task(filePath: string, projectRoot: string): Result {
  // ...
}
```

```ts [Example (src/steps/analyze-files/worker.ts)]
import { runWorker } from '@codemod-utils/threads';

import { task } from './task.js';

runWorker(task);
```

:::


### runWorker {#api-run-worker}

Runs a task on a worker.

> [!TIP]
> 
> Note, a worker file always uses the code shown below. You just need to import the task from the right file.

::: code-group

```ts [Signature]
/**
 * @param task
 *
 * Some function to call.
 */
type Task<T extends unknown[], U> = (...dataset: T) => U | Promise<U>;

function runWorker<T extends unknown[], U>(task: Task<T, U>): void;
```

```ts [Example (Worker)]{5}
import { runWorker } from '@codemod-utils/threads';

import { task } from './task.js';

runWorker(task);
```

:::
