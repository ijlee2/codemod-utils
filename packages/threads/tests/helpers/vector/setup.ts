import { assert } from '@codemod-utils/tests';

type Vector = number[];

type Options = {
  id: string;
  isRandom: boolean;
};

function vecInit(n: number): Vector {
  return new Array(n).fill(0) as Vector;
}

function vecInitRandom(n: number): Vector {
  const vector = vecInit(n);

  for (let i = 0; i < n; i++) {
    vector[i] = Math.random();
  }

  return vector;
}

function vecNorm(vector: Vector): number {
  let norm = 0;

  vector.forEach((x) => {
    norm += Math.pow(x, 2);
  });

  return Math.sqrt(norm);
}

export function assertOutput(output: Vector[]): void {
  const tolerance = 1e-4;
  let failed = false;

  output.forEach((vector) => {
    const norm = vecNorm(vector);

    if (Math.abs(norm - 0) > tolerance && Math.abs(norm - 1) > tolerance) {
      failed = true;
      return;
    }
  });

  assert.strictEqual(failed, false);
}

export function getDatasets(numTasks: number): Parameters<typeof task>[] {
  const datasets: [Vector, Options][] = [];

  for (let i = 0; i < numTasks; i++) {
    const isRandom = i % 2 === 0;
    const vector = isRandom ? vecInitRandom(1000) : vecInit(1000);

    datasets.push([
      vector,
      {
        id: `task-${i + 1}`,
        isRandom,
      },
    ]);
  }

  return datasets;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function task(vector: Vector, _options: Options): Vector {
  const newVector = vecInit(vector.length);
  const norm = vecNorm(vector);

  if (norm === 0) {
    return newVector;
  }

  const normInv = 1 / norm;

  for (let i = 0; i < newVector.length; i++) {
    newVector[i] = normInv * vector[i]!;
  }

  return newVector;
}

export function taskThatErrors(vector: Vector, options: Options): Vector {
  if (options.isRandom) {
    throw new Error(`Could not run ${options.id}`);
  }

  return task(vector, options);
}
