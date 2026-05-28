import { parse as babelParser, type ParserOptions } from '@babel/parser';
import {
  type Options as FormattingOptions,
  parse,
  print as _print,
  types,
  visit,
} from 'recast';

/* https://github.com/benjamn/recast/blob/v0.23.11/lib/options.ts#L7 */
const formattingOptions: FormattingOptions = {
  quote: 'single',
};

/* https://github.com/facebook/jscodeshift/blob/v17.3.0/parser/tsOptions.js#L14-L46 */
const tsOptions: ParserOptions = {
  sourceType: 'module',
  allowImportExportEverywhere: true,
  allowReturnOutsideFunction: true,
  startLine: 1,
  tokens: true,
  plugins: [
    'asyncGenerators',
    'decoratorAutoAccessors',
    'bigInt',
    'classPrivateMethods',
    'classPrivateProperties',
    'classProperties',
    'decorators-legacy',
    'doExpressions',
    'dynamicImport',
    'exportDefaultFrom',
    // @ts-expect-error: Type '"exportExtensions"' is not assignable to type 'PluginConfig'.
    'exportExtensions',
    'exportNamespaceFrom',
    'functionBind',
    'functionSent',
    'importAttributes',
    'importMeta',
    'nullishCoalescingOperator',
    'numericSeparator',
    'objectRestSpread',
    'optionalCatchBinding',
    'optionalChaining',
    ['pipelineOperator', { proposal: 'minimal' }],
    'throwExpressions',
    'typescript',
  ],
};

export const builders: typeof types.builders = types.builders;

export function print(ast: types.ASTNode): string {
  const { code } = _print(ast, formattingOptions);

  return code;
}

export function traverse() {
  return function (
    file: string,
    visitMethods: types.Visitor = {},
  ): types.ASTNode {
    const ast = parse(file, {
      parser: {
        parse(file: string) {
          return babelParser(file, tsOptions);
        },
      },
    }) as types.ASTNode;

    visit(ast, visitMethods);

    return ast;
  };
}
