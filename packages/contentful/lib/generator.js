// @ts-check
import fs from 'node:fs';
import path from 'node:path';
import url from 'node:url';

const typingsFilePath = path.resolve(
  url.fileURLToPath(new URL('.', import.meta.url)),
  '..',
  'src',
  'typings.ts',
);

const toPascalCase = (str) =>
  str
    .split(' ')
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');

const env = {
  // Please set env
  CONTENTFUL_SPACE_ID: process.env.CONTENTFUL_SPACE_ID,
  CONTENTFUL_ENVIRONMENT: process.env.CONTENTFUL_ENVIRONMENT,
  CONTENTFUL_ACCESS_TOKEN: process.env.CONTENTFUL_ACCESS_TOKEN,
};

async function main() {
  const { items: contentTypes } = await fetch(
    `https://cdn.contentful.com/spaces/${env.CONTENTFUL_SPACE_ID}/environments/${env.CONTENTFUL_ENVIRONMENT}/content_types?access_token=${env.CONTENTFUL_ACCESS_TOKEN}`,
  ).then((res) => res.json());

  let interfaceString =
    '/* eslint-disable */\n// THIS IS AN AUTOGENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY.';

  for (const contentType of contentTypes) {
    interfaceString += '\n\n';

    const { name, description, fields } = contentType;

    const interfaceName = toPascalCase(name);

    if (description) {
      interfaceString += `/**\n * ${description}\n */\n`;
    }

    interfaceString += `export interface ${interfaceName}{{Generics}} {\n`;

    const generics = [];

    fields.forEach((field) => {
      let tsType;
      const { id, name, type, required } = field;
      const typeName = toPascalCase(name);
      switch (type) {
        case 'Symbol':
        case 'Text':
          tsType = 'string';
          break;
        case 'Integer':
        case 'Number':
          tsType = 'number';
          break;
        case 'Date':
          tsType = 'Date';
          break;
        case 'Boolean':
          tsType = 'boolean';
          break;
        case 'Array': {
          const arrayGenericType = `T${typeName}`;
          generics.push(arrayGenericType);
          tsType = `${arrayGenericType}[]`;
          break;
        }
        case 'Object':
        case 'RichText':
        case 'Location':
        case 'Link':
        case 'ResourceLink': {
          const genericType = `T${typeName}`;
          generics.push(genericType);
          tsType = genericType;
          break;
        }
        default:
          tsType = 'unknown';
      }

      interfaceString += `  ${id}${required ? ':' : '?:'} ${tsType};\n`;
    });

    interfaceString += '}';

    interfaceString = interfaceString.replace(
      '{{Generics}}',
      generics.length > 0 ? `<${generics.join(', ')}>` : '',
    );
  }

  const { items: locals } = await fetch(
    `https://cdn.contentful.com/spaces/${process.env.CONTENTFUL_SPACE_ID}/environments/${process.env.CONTENTFUL_ENVIRONMENT}/locales?access_token=${process.env.CONTENTFUL_ACCESS_TOKEN}`,
  ).then((res) => res.json());

  interfaceString += `\n\nexport type Locales = ${locals.map((local) => `"${local.code}"`).join(' | ')} \n`;

  fs.writeFileSync(typingsFilePath, interfaceString, 'utf-8');
}

main()
  .then(() => {
    console.log('contentful content model generator successful.');
  })
  .catch((e) => {
    console.log(e.message);
    process.exit(0);
  });
