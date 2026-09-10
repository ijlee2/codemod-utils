import baseConfiguration from '@shared-configs/eslint-config-node/typescript';

export default [
  ...baseConfiguration,
  {
    ignores: [
      'blob-report/',
      'playwright-report/',
      'src/snippets/',
      'test-results/',
    ],
  },
];
