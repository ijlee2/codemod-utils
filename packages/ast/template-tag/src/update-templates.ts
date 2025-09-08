import { preprocess } from './preprocess.js';
import { replaceTemplate } from './replace-template.js';

export function updateTemplates(
  file: string,
  update: (code: string) => string,
): string {
  const { templateTags } = preprocess(file);

  templateTags.reverse().forEach(({ contents, range }) => {
    const template = update(contents);

    file = replaceTemplate(file, { range, template });
  });

  return file;
}
