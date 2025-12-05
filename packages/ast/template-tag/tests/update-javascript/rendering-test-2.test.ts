import { assert, normalizeFile, test } from '@codemod-utils/tests';

import { updateJavaScript } from '../../src/index.js';
import { data, renameGetters } from '../helpers/update-javascript.js';

test('update-javascript > rendering test (2)', function () {
  const oldFile = normalizeFile([
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

  const newFile = updateJavaScript(oldFile, (code) => {
    return renameGetters(code, data);
  });

  assert.strictEqual(
    newFile,
    normalizeFile([
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
      `        // Assigned new name`,
      `        get __timestamp(): string {`,
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
      `    await render(<template>`,
      `    <Example1 class="my-style" />`,
      `    </template>);`,
      ``,
      `    assert.ok(true);`,
      `  });`,
      `});`,
      ``,
    ]),
  );

  const newFile2 = updateJavaScript(newFile, (code) => {
    return renameGetters(code, data);
  });

  assert.strictEqual(newFile2, newFile);
});
