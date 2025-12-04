import { assert, createFile, test } from '@codemod-utils/tests';

import { updateTemplates } from '../../src/index.js';
import { identity } from '../helpers/index.js';

test('update-templates > update is identity (3)', function () {
  const oldFile = createFile([
    `import Service from '@ember/service';`,
    `import { type Registry as Services, service } from '@ember/service';`,
    `import { click, render, type TestContext } from '@ember/test-helpers';`,
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
    `  module('Styles', function () {`,
    `    test('Splattributes', async function (this: TestContext, assert) {`,
    `      await render(`,
    `        <template>`,
    `          <Example1 class="my-style" />`,
    `        </template>,`,
    `      );`,
    ``,
    `      assert.ok(true);`,
    `    });`,
    `  });`,
    ``,
    `  test('We can click on the button', async function (assert) {`,
    `    await render(<template><Example1 class="my-style" /></template>);`,
    ``,
    `    await click('button');`,
    ``,
    `    assert.ok(true);`,
    `  });`,
    `});`,
    ``,
  ]);

  const newFile = updateTemplates(oldFile, identity);

  assert.strictEqual(newFile, oldFile);

  const newFile2 = updateTemplates(newFile, identity);

  assert.strictEqual(newFile2, newFile);
});
