import { AST } from '@codemod-utils/ast-javascript';

import { getTemplate, MARKER } from './content-tag.js';

export function removeMarkers(file: string): string {
  if (!file.includes(MARKER)) {
    return file;
  }

  const traverse = AST.traverse(true);

  const ast = traverse(file, {
    visitCallExpression(path) {
      const template = getTemplate(path.node);

      if (template === undefined) {
        this.traverse(path);

        return false;
      }

      return `<template>${template}</template>`;
    },

    visitExportDefaultDeclaration(path) {
      const template = getTemplate(path.node.declaration);

      if (template === undefined) {
        this.traverse(path);

        return false;
      }

      return `<template>${template}</template>`;
    },

    visitImportDeclaration(path) {
      if (
        path.node.source.type !== 'StringLiteral' ||
        path.node.source.value !== '@ember/template-compiler'
      ) {
        return false;
      }

      // For simplicity, always remove the import statement
      return null;
    },

    visitStaticBlock(path) {
      const bodyNode = path.node.body[0]!;

      if (bodyNode.type !== 'ExpressionStatement') {
        return false;
      }

      const template = getTemplate(bodyNode.expression);

      if (template === undefined) {
        return false;
      }

      return `<template>${template}</template>`;
    },
  });

  return AST.print(ast);
}
