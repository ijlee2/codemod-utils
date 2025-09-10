import { assert, test } from '@codemod-utils/tests';

import { findTemplateTags } from '../../src/index.js';

test('find-template-tags > rendering test (1)', function () {
  const oldFile = [
    `import Service from '@ember/service';`,
    `import { type Registry as Services, service } from '@ember/service';`,
    `import { render, type TestContext } from '@ember/test-helpers';`,
    `import { hbs } from 'ember-cli-htmlbars';`,
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
    `    await render(hbs\`<Example1 />\`);`,
    ``,
    `    assert.ok(true);`,
    `  });`,
    ``,
    `  test('We can pass styles', async function (this: TestContext, assert) {`,
    `    await render<TestContext>(`,
    `      hbs\``,
    `        <Example1 class="my-style" />`,
    `      \`,`,
    `    );`,
    ``,
    `    assert.ok(true);`,
    `  });`,
    `});`,
    ``,
  ].join('\n');

  const templateTags = findTemplateTags(oldFile);

  assert.deepStrictEqual(templateTags, []);
});
