import { assert, createFile, test } from '@codemod-utils/tests';

import { findTemplateTags } from '../../src/index.js';

test('find-template-tags > rendering test (2)', function () {
  const oldFile = createFile([
    `import Service from '@ember/service';`,
    `import { type Registry as Services, service } from '@ember/service';`,
    `import { render, type TestContext } from '@ember/test-helpers';`,
    `import { setupRenderingTest } from 'ember-qunit';`,
    `import Example1 from 'my-app/components/example-1';`,
    `import { module, test } from 'qunit';`,
    ``,
    `module('Integration | Component | example-1', function (hooks) {`,
    `  setupRenderingTest(hooks);`,
    ``,
    `  hooks.beforeEach(function (assert) {`,
    `    this.owner.register(`,
    `      'service:example-1/business-logic',`,
    `      class Example1BusinessLogic extends Service {`,
    `        @service declare intl: Services['intl'];`,
    ``,
    `        get timestamp(): string {`,
    `          return '2025-01-01';`,
    `        }`,
    `      },`,
    `    );`,
    `  });`,
    ``,
    `  test('it renders', async function (assert) {`,
    `    await render(<template><Example1 /></template>);`,
    ``,
    `    assert.ok(true);`,
    `  });`,
    ``,
    `  test('We can pass styles', async function (this: TestContext, assert) {`,
    `    await render(`,
    `      <template>`,
    `        <Example1 class="my-style" />`,
    `      </template>,`,
    `    );`,
    ``,
    `    assert.ok(true);`,
    `  });`,
    `});`,
    ``,
  ]);

  const templateTags = findTemplateTags(oldFile);

  assert.deepStrictEqual(templateTags, [
    {
      contentRange: {
        endByte: 799,
        endChar: 799,
        startByte: 787,
        startChar: 787,
      },
      contents: '<Example1 />',
      endRange: {
        endByte: 810,
        endChar: 810,
        startByte: 799,
        startChar: 799,
      },
      range: {
        endByte: 810,
        endChar: 810,
        startByte: 777,
        startChar: 777,
      },
      startRange: {
        endByte: 787,
        endChar: 787,
        startByte: 777,
        startChar: 777,
      },
      tagName: 'template',
      type: 'expression',
    },
    {
      contentRange: {
        endByte: 995,
        endChar: 995,
        startByte: 950,
        startChar: 950,
      },
      contents: createFile([
        ``,
        `        <Example1 class="my-style" />`,
        `      `,
      ]),
      endRange: {
        endByte: 1006,
        endChar: 1006,
        startByte: 995,
        startChar: 995,
      },
      range: {
        endByte: 1006,
        endChar: 1006,
        startByte: 940,
        startChar: 940,
      },
      startRange: {
        endByte: 950,
        endChar: 950,
        startByte: 940,
        startChar: 940,
      },
      tagName: 'template',
      type: 'expression',
    },
  ]);
});
