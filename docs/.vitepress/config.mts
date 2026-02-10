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
    nav: [],
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
