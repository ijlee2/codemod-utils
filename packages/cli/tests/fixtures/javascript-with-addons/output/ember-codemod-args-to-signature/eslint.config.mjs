import baseConfiguration from '@ijlee2-frontend-configs/eslint-config-node/javascript';

export default [
  {
    ignores: [
      'dist/',
      'dist-for-testing/',
      'node_modules/',
      'src/blueprints/',
      'tests/fixtures/',
      'tmp/',
      '.*/',
    ],
  },
  ...baseConfiguration,
];
