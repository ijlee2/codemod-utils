import template from 'lodash.template';

export function processTemplate(file: string, data?: object): string {
  const settings = {
    escape: /<%-([\s\S]+?)%>/g,
    evaluate: /<%([\s\S]+?)%>/g,
    interpolate: /<%=([\s\S]+?)%>/g,
  };

  return template(file, settings)(data);
}
