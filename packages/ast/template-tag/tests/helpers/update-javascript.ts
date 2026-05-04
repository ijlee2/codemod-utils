import { AST } from '@codemod-utils/ast-javascript';

type Data = {
  getters: Set<string>;
};

export const data: Data = {
  getters: new Set(['errorMessage', 'timestamp', 'type']),
};

export function renameGetters(file: string, data: Data): string {
  const traverse = AST.traverse(true);

  const ast = traverse(file, {
    visitClassMethod(path) {
      if (path.node.kind !== 'get' || path.node.key.type !== 'Identifier') {
        return false;
      }

      const getterName = path.node.key.name;

      if (!data.getters.has(getterName)) {
        return false;
      }

      path.node.comments = [
        AST.builders.commentLine(' Assigned new name'),
        ...(path.node.comments ?? []),
      ];

      path.node.key.name = `__${getterName}`;

      return false;
    },
  });

  return AST.print(ast);
}
