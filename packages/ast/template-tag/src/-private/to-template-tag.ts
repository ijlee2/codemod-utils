import { AST } from '@codemod-utils/ast-javascript';

import { getTemplate, MARKER } from './content-tag.js';

export function removeMarkers(file: string): string {
  if (!file.includes(MARKER)) {
    return file;
  }

  const traverse = AST.traverse(true);

  const ast = traverse(file, {
    visitCallExpression(node) {
      const template = getTemplate(node.value);

      if (template === undefined) {
        this.traverse(node);

        return false;
      }

      return `<template>${template}</template>`;
    },

    visitExportDefaultDeclaration(node) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      const template = getTemplate(node.value.declaration);

      if (template === undefined) {
        this.traverse(node);

        return false;
      }

      return `<template>${template}</template>`;
    },

    visitImportDeclaration(node) {
      if (
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        node.value.source.type !== 'StringLiteral' ||
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        node.value.source.value !== '@ember/template-compiler'
      ) {
        return false;
      }

      // For simplicity, always remove the import statement
      return null;
    },

    visitStaticBlock(node) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      const bodyNode = node.value.body[0];

      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (bodyNode.type !== 'ExpressionStatement') {
        return false;
      }

      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      const template = getTemplate(bodyNode.expression);

      if (template === undefined) {
        return false;
      }

      return `<template>${template}</template>`;
    },
  });

  return AST.print(ast);
}
