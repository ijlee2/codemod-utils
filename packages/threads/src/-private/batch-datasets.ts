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
