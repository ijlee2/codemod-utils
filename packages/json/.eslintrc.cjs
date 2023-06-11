'use strict';

require('@shared-configs/eslint-config/patch');

module.exports = {
  extends: ['@shared-configs/eslint-config/node-typescript'],
  overrides: [
    {
      files: ['**/*.{js,ts}'],
      rules: {
        'n/no-missing-import': [
          'error',
          {
            allowModules: ['type-fest'],
          },
        ],
      },
    },
  ],
};
