import { assert, normalizeFile, test } from '@codemod-utils/tests';

import {
  type AST,
  parse,
  print,
} from '../../../src/-private/glimmer-syntax.js';

test('-private | glimmer-syntax | NullLiteral > it should print correctly', function () {
  const template = normalizeFile([`{{contact-null`, `  null`, `}}`]);
  const ast = parse(template);

  const mustache = ast.body[0] as AST.MustacheStatement;
  const param = mustache.params[0] as AST.BaseNode;

  // Mark the param as dirty
  const oldType = param.type;
  param.type = 'ElementNode';
  param.type = oldType;

  assert.strictEqual(
    print(ast),
    normalizeFile([`{{contact-null`, `  null`, `}}`]),
  );
});
