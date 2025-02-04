import eslintConfigNodeTypescript from '@shared-configs/eslint-config-node/typescript/index.js';

export default [
  {
    ignores: [
      'dist/',
      'dist-for-testing/',
      'node_modules/',
      'src/blueprints/',
      'tests/fixtures/',
      'tmp/',
      '!.*',
      '.*/',
    ],
  },

  ...eslintConfigNodeTypescript,
];
