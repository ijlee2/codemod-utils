#!/usr/bin/env node
// eslint-disable-next-line n/shebang
'use strict';

import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

import { runCodemod } from '../src/index.js';
import type { CodemodOptions } from '../src/types/index.js';

// Provide a title to the process in `ps`
process.title = 'ember-codemod-args-to-signature';

// Set codemod options
const argv = yargs(hideBin(process.argv))
  .option('root', {
    describe: 'Where to run the codemod',
    type: 'string',
  })
  .parseSync();

const codemodOptions: CodemodOptions = {
  projectRoot: argv['root'] ?? process.cwd(),
};

runCodemod(codemodOptions);
