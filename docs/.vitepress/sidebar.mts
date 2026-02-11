import type { DefaultTheme } from 'vitepress/theme';

export const sidebar: DefaultTheme.Sidebar = [
  {
    collapsed: false,
    items: [
      {
        link: '/docs/quickstart',
        text: 'Quickstart',
      },
    ],
    text: 'Getting Started',
  },
  {
    collapsed: false,
    items: [
      {
        collapsed: true,
        items: [
          {
            link: '/docs/tutorials/main-tutorial/00-introduction',
            text: '0. Introduction',
          },
          {
            link: '/docs/tutorials/main-tutorial/01-create-a-project',
            text: '1. Create a project',
          },
          {
            link: '/docs/tutorials/main-tutorial/02-understand-the-folder-structure',
            text: '2. Understand the folder structure',
          },
          {
            link: '/docs/tutorials/main-tutorial/03-sketch-out-the-solution',
            text: '3. Sketch out the solution',
          },
          {
            link: '/docs/tutorials/main-tutorial/04-update-acceptance-tests-part-1',
            text: '4. Update acceptance tests (Part 1)',
          },
          {
            link: '/docs/tutorials/main-tutorial/05-update-acceptance-tests-part-2',
            text: '5. Update acceptance tests (Part 2)',
          },
          {
            link: '/docs/tutorials/main-tutorial/06-update-integration-tests',
            text: '6. Update integration tests',
          },
          {
            link: '/docs/tutorials/main-tutorial/07-update-unit-tests',
            text: '7. Update unit tests',
          },
          {
            link: '/docs/tutorials/main-tutorial/08-refactor-code-part-1',
            text: '8. Refactor code (Part 1)',
          },
          {
            link: '/docs/tutorials/main-tutorial/09-refactor-code-part-2',
            text: '9. Refactor code (Part 2)',
          },
          {
            link: '/docs/tutorials/main-tutorial/10-conclusion',
            text: '10. Conclusion',
          },
        ],
        text: 'Main tutorial',
      },
      {
        collapsed: true,
        items: [
          {
            link: '/docs/tutorials/create-blueprints/00-introduction',
            text: '0. Introduction',
          },
          {
            link: '/docs/tutorials/create-blueprints/01-create-a-project',
            text: '1. Create a project',
          },
          {
            link: '/docs/tutorials/create-blueprints/02-create-static-files',
            text: '2. Create static files',
          },
          {
            link: '/docs/tutorials/create-blueprints/03-define-options',
            text: '3. Define options',
          },
          {
            link: '/docs/tutorials/create-blueprints/04-create-dynamic-files',
            text: '4. Create dynamic files',
          },
          {
            link: '/docs/tutorials/create-blueprints/05-conclusion',
            text: '5. Conclusion',
          },
        ],
        text: 'Create blueprints',
      },
      {
        collapsed: true,
        items: [
          {
            link: '/docs/tutorials/support-windows/00-introduction',
            text: '0. Introduction',
          },
          {
            link: '/docs/tutorials/support-windows/01-beware-of-file-paths',
            text: '1. Beware of file paths',
          },
          {
            link: '/docs/tutorials/support-windows/02-beware-of-line-breaks',
            text: '2. Beware of line breaks',
          },
        ],
        text: 'Support Windows',
      },
      {
        collapsed: true,
        items: [
          {
            link: '/docs/tutorials/update-css-files/00-introduction',
            text: '0. Introduction',
          },
          {
            link: '/docs/tutorials/update-css-files/01-use-existing-plugins',
            text: '1. Use existing plugins',
          },
          {
            link: '/docs/tutorials/update-css-files/02-write-custom-plugins',
            text: '2. Write custom plugins',
          },
          {
            link: '/docs/tutorials/update-css-files/03-conclusion',
            text: '3. Conclusion',
          },
        ],
        text: 'Update CSS files',
      },
      {
        collapsed: true,
        items: [
          {
            link: '/docs/tutorials/update-template-tags/00-introduction',
            text: '0. Introduction',
          },
          {
            link: '/docs/tutorials/update-template-tags/01-create-a-project',
            text: '1. Create a project',
          },
          {
            link: '/docs/tutorials/update-template-tags/02-tackle-hbs',
            text: '2. Tackle *.hbs',
          },
          {
            link: '/docs/tutorials/update-template-tags/03-tackle-gjs-gts',
            text: '3. Tackle *.{gjs,gts}',
          },
          {
            link: '/docs/tutorials/update-template-tags/04-conclusion',
            text: '4. Conclusion',
          },
        ],
        text: 'Update &lt;template&gt; tags',
      },
    ],
    text: 'Tutorials',
  },
];
