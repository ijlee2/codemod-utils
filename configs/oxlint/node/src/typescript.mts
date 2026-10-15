import baseConfiguration from '@ijlee2-frontend-configs/oxlint-node/typescript';
import type { OxlintConfig } from 'oxlint';

export default {
  ...baseConfiguration,
  ignorePatterns: [
    'dist/',
    'dist-for-testing/',
    'node_modules/',
    'src/blueprints/',
    'tests/fixtures/',
    'tmp/',
    '.*/',
  ],
} satisfies OxlintConfig;
