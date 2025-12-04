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
    visitClassMethod(node) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (node.value.kind !== 'get') {
        return false;
      }

      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      const getterName = node.value.key.name as string;

      if (!data.getters.has(getterName)) {
        return false;
      }

      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      node.value.comments = [
        AST.builders.commentLine(' Assigned new name'),
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        ...(node.value.comments ?? []),
      ];

      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      node.value.key.name = `__${getterName}`;

      return false;
    },
  });

  return AST.print(ast);
}
