import { defineConfig } from 'vitepress';

import { sidebar } from './sidebar.mts';

export default defineConfig({
  base: '/',
  cleanUrls: true,
  description: 'Utilities for writing codemods',
  markdown: {
    anchor: {
      level: [2, 3],
    },
    // https://github.com/vuejs/vitepress/discussions/3724
    config(md) {
      const defaultCodeInline = md.renderer.rules.code_inline!;

      md.renderer.rules.code_inline = (tokens, idx, options, env, self) => {
        tokens[idx]?.attrSet('v-pre', '');

        return defaultCodeInline(tokens, idx, options, env, self);
      };
    },
    image: {
      lazyLoading: true,
    },
    lineNumbers: true,
    theme: {
      light: 'github-light-default',
      dark: 'github-dark-default',
    },
  },
  srcDir: 'src',
  themeConfig: {
    editLink: {
      pattern:
        'https://github.com/ijlee2/codemod-utils/edit/main/docs/src/:path',
      text: 'Edit this page on GitHub',
    },
    nav: [
      {
        link: '/docs',
        text: 'Overview',
      },
      {
        items: [
          {
            link: 'https://github.com/ijlee2/codemod-utils/blob/main/packages/ast/javascript/CHANGELOG.md',
            text: '@codemod-utils/ast-javascript',
          },
          {
            link: 'https://github.com/ijlee2/codemod-utils/blob/main/packages/ast/template/CHANGELOG.md',
            text: '@codemod-utils/ast-template',
          },
          {
            link: 'https://github.com/ijlee2/codemod-utils/blob/main/packages/ast/template-tag/CHANGELOG.md',
            text: '@codemod-utils/ast-template-tag',
          },
          {
            link: 'https://github.com/ijlee2/codemod-utils/blob/main/packages/blueprints/CHANGELOG.md',
            text: '@codemod-utils/blueprints',
          },
          {
            link: 'https://github.com/ijlee2/codemod-utils/blob/main/packages/cli/CHANGELOG.md',
            text: '@codemod-utils/cli',
          },
          {
            link: 'https://github.com/ijlee2/codemod-utils/blob/main/packages/ember/CHANGELOG.md',
            text: '@codemod-utils/ember',
          },
          {
            link: 'https://github.com/ijlee2/codemod-utils/blob/main/packages/files/CHANGELOG.md',
            text: '@codemod-utils/files',
          },
          {
            link: 'https://github.com/ijlee2/codemod-utils/blob/main/packages/package-json/CHANGELOG.md',
            text: '@codemod-utils/package-json',
          },
          {
            link: 'https://github.com/ijlee2/codemod-utils/blob/main/packages/tests/CHANGELOG.md',
            text: '@codemod-utils/tests',
          },
        ],
        text: 'Changelogs',
      },
    ],
    outline: {
      level: [2, 3],
    },
    search: {
      provider: 'local',
    },
    sidebar,
    socialLinks: [
      {
        icon: 'github',
        link: 'https://github.com/ijlee2/codemod-utils',
      },
    ],
  },
  title: 'codemod-utils',
});
