#!/usr/bin/env node
'use strict';

import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

import { createCodemod } from '../src/index.js';

// Provide a title to the process in `ps`
process.title = '@codemod-utils/cli';

// Set codemod options
yargs(hideBin(process.argv))
  .command({
    builder: (yargs) => {
      return yargs
        .positional('name', {
          describe: 'Name of your codemod',
          type: 'string',
        })
        .option('addon', {
          choices: [
            'ast-javascript',
            'ast-template',
            'ast-template-tag',
            'blueprints',
            'ember',
            'package-json',
          ] as const,
          describe: 'Optional @codemod-utils packages to install',
          type: 'array',
        })
        .option('root', {
          describe: 'Where to run @codemod-utils/cli',
          type: 'string',
        })
        .option('typescript', {
          default: true,
          describe: 'Create a TypeScript project?',
          type: 'boolean',
        })
        .demandOption(['name']);
    },
    command: '* [name]',
    describe: 'Creates a codemod project',
    handler: (argv) => {
      createCodemod({
        addons: new Set(argv['addon']),
        hasTypeScript: argv['typescript'],
        name: argv['name'],
        projectRoot: argv['root'] ?? process.cwd(),
      });
    },
  })
  .demandCommand()
  .strict()
  .parseSync();
