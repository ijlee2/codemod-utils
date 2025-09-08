const MARKER = 'template_fd9b2463e5f141cfb5666b64daa1f11a';

function markTemplateTags(file: string): string {
  const lines = file.split('\n');

  return lines
    .reduce<string[]>((accumulator, line) => {
      if (line.includes('<template>')) {
        accumulator.push(`/* ${MARKER}`);
      }

      accumulator.push(line);

      if (line.includes('</template>')) {
        accumulator.push(`${MARKER} */`);
      }

      return accumulator;
    }, [])
    .join('\n');
}

function unmarkTemplateTags(file: string): string {
  const lines = file.split('\n');

  return lines
    .reduce<string[]>((accumulator, line) => {
      if (line.includes(`/* ${MARKER}`) || line.includes(`${MARKER} */`)) {
        return accumulator;
      }

      accumulator.push(line);

      return accumulator;
    }, [])
    .join('\n');
}

export function updateJavaScript(
  file: string,
  update: (code: string) => string,
): string {
  file = update(markTemplateTags(file));

  return unmarkTemplateTags(file);
}
