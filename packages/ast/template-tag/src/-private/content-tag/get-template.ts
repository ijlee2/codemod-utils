import type { AST } from '@codemod-utils/ast-javascript';

import { MARKER } from './marker.js';

type CallExpression = ReturnType<typeof AST.builders.callExpression>;

export function getTemplate(expression: CallExpression): string | undefined {
  if (
    expression.callee.type !== 'Identifier' ||
    expression.callee.name !== MARKER
  ) {
    return undefined;
  }

  // @ts-expect-error: Incorrect type
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  const template = expression.arguments[0]!.quasis[0].value.raw as string;

  return template;
}
