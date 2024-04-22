'use strict';

require('@shared-configs/eslint-config-node/patch');

module.exports = {
  extends: ['@shared-configs/eslint-config-node/typescript'],
  overrides: [
    {
      files: ['bin/**/*.{js,ts}'],
      rules: {
        'n/hashbang': 'off',
      },
    },
  ],
};
