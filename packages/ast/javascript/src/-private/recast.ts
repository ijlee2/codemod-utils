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

/* https://github.com/facebook/jscodeshift/blob/v0.15.2/parser/babel5Compat.js#L15-L38 */
const jsOptions: ParserOptions = {
  sourceType: 'module',
  allowHashBang: true,
  ecmaVersion: Infinity,
  allowImportExportEverywhere: true,
  allowReturnOutsideFunction: true,
  startLine: 1,
  tokens: true,
  plugins: [
    'estree',
    'jsx',
    'asyncGenerators',
    'classProperties',
    'doExpressions',
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore Type '"exportExtensions"' is not assignable to type 'PluginConfig'.
    'exportExtensions',
    'functionBind',
    'functionSent',
    'objectRestSpread',
    'dynamicImport',
    'nullishCoalescingOperator',
    'optionalChaining',
    ['decorators', { decoratorsBeforeExport: true }],
  ],
};

/* https://github.com/facebook/jscodeshift/blob/v0.15.2/parser/tsOptions.js#L14-L44 */
const tsOptions: ParserOptions = {
  sourceType: 'module',
  allowImportExportEverywhere: true,
  allowReturnOutsideFunction: true,
  startLine: 1,
  tokens: true,
  plugins: [
    'asyncGenerators',
    'bigInt',
    'classPrivateMethods',
    'classPrivateProperties',
    'classProperties',
    'decorators-legacy',
    'doExpressions',
    'dynamicImport',
    'exportDefaultFrom',
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore Type '"exportExtensions"' is not assignable to type 'PluginConfig'.
    'exportExtensions',
    'exportNamespaceFrom',
    'functionBind',
    'functionSent',
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

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
function getParseOptions(isTypeScript?: boolean) {
  const options = isTypeScript ? tsOptions : jsOptions;

  return {
    parser: {
      // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
      parse(file: string) {
        return babelParser(file, options);
      },
    },
  };
}

export const builders: typeof types.builders = types.builders;

export function print(ast: types.ASTNode): string {
  const { code } = _print(ast, formattingOptions);

  return code;
}

export function traverse(isTypeScript?: boolean) {
  return function (
    file: string,
    visitMethods: types.Visitor = {},
  ): types.ASTNode {
    const ast = parse(file, getParseOptions(isTypeScript)) as types.ASTNode;

    visit(ast, visitMethods);

    return ast;
  };
}
