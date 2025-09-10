/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access */
import { AST } from '@codemod-utils/ast-javascript';

const MARKER = 'template_fd9b2463e5f141cfb5666b64daa1f11a';

function getTemplateTag(expression: unknown): string | undefined {
  // @ts-expect-error: Incorrect type
  if (expression.type !== 'CallExpression') {
    return;
  }

  if (
    // @ts-expect-error: Incorrect type
    expression.callee.type !== 'Identifier' ||
    // @ts-expect-error: Incorrect type
    expression.callee.name !== MARKER
  ) {
    return;
  }

  // @ts-expect-error: Incorrect type
  const template = expression.arguments[0].quasis[0].value.raw as string;

  return `<template>${template}</template>`;
}

export function toTemplateTag(ecma: string): string {
  const traverse = AST.traverse(true);

  const ast = traverse(ecma, {
    visitImportDeclaration(node) {
      if (
        node.value.source.type !== 'StringLiteral' ||
        node.value.source.value !== '@ember/template-compiler'
      ) {
        return false;
      }

      // For simplicity, always remove the import statement
      return null;
    },

    visitStaticBlock(node) {
      const bodyNode = node.value.body[0];

      if (bodyNode.type !== 'ExpressionStatement') {
        return false;
      }

      const templateTag = getTemplateTag(bodyNode.expression);

      if (templateTag === undefined) {
        return false;
      }

      return templateTag;
    },
  });

  return AST.print(ast);
}
