import type { CodemodOptions } from '../types/index.js';
import { createOptions } from './steps/index.js';

export function createCodemod(codemodOptions: CodemodOptions): void {
  const options = createOptions(codemodOptions);

  console.log(options);
}
