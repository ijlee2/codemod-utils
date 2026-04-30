import { AST } from '@codemod-utils/ast-javascript';

import { getTemplate, preprocessor } from './content-tag.js';

type Marker = {
  code: string;
  end: {
    column: number;
    index: number;
    line: number;
    token: number;
  };
};

function sortMarkers(a: Marker, b: Marker): number {
  if (a.end.line > b.end.line) {
    return -1;
  }

  if (a.end.line < b.end.line) {
    return 1;
  }

  if (a.end.column > b.end.column) {
    return -1;
  }

  if (a.end.column < b.end.column) {
    return 1;
  }

  return 0;
}

export function findMarkers(file: string): Marker[] {
  const { code } = preprocessor.process(file);
  const traverse = AST.traverse(true);

  const markers: Marker[] = [];

  traverse(code, {
    visitCallExpression(path) {
      const template = getTemplate(path.node);

      if (template === undefined) {
        this.traverse(path);

        return false;
      }

      markers.push({
        code: AST.print(path.node),
        // @ts-expect-error: Incorrect type
        end: path.node.loc!.end,
      });

      return false;
    },

    visitExportDefaultDeclaration(path) {
      const template = getTemplate(path.node.declaration);

      if (template === undefined) {
        this.traverse(path);

        return false;
      }

      markers.push({
        code: AST.print(path.node),
        // @ts-expect-error: Incorrect type
        end: path.node.loc!.end,
      });

      return false;
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

      markers.push({
        code: AST.print(path.node),
        // @ts-expect-error: Incorrect type
        end: path.node.loc!.end,
      });

      return false;
    },
  });

  return markers.sort(sortMarkers);
}
