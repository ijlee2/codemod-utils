import { type Parsed as TemplateTag, Preprocessor } from 'content-tag';

const preprocessor = new Preprocessor();

export function preprocess(file: string): {
  javascript: string;
  templateTags: TemplateTag[];
} {
  const javascript = preprocessor.process(file).code;
  const templateTags = preprocessor.parse(file);

  return {
    javascript,
    templateTags,
  };
}
