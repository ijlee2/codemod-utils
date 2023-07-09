import { addEndOfLine, createOptions } from './steps/index.js';

export function runCodemod(codemodOptions) {
  const options = createOptions(codemodOptions);

  // TODO: Replace with actual steps
  addEndOfLine(options);
}
