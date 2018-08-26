// std
import { existsSync } from 'fs';

// FoalTS
import { Generator, getNames, renderTemplate, updateFile } from '../../utils';

export type ServiceType = 'Empty'|'ResourceCollection'|'EntityResourceCollection'|'GraphQLResolver'
  |'Authenticator'|'EmailAuthenticator';

export function createService({ name, type }: { name: string, type: ServiceType }) {
  const names = getNames(name);

  let root = '';

  if (existsSync('src/app/services')) {
    root = 'src/app/services';
  } else if (existsSync('services')) {
    root = 'services';
  }

  const generator = new Generator('service', root);

  switch (type) {
    case 'Empty':
      generator
        .renderTemplate('service.empty.ts', names, `${names.kebabName}.service.ts`);
      break;
    case 'ResourceCollection':
      generator
        .renderTemplate('service.resource-collection.ts', names, `${names.kebabName}-collection.service.ts`);
      break;
    case 'EntityResourceCollection':
      generator
        .renderTemplate('service.entity-resource-collection.ts', names, `${names.kebabName}-collection.service.ts`);
      break;
    case 'GraphQLResolver':
      generator
        .renderTemplate('service.graphql-resolver.ts', names, `${names.kebabName}-resolver.service.ts`);
      break;
    case 'Authenticator':
      generator
        .renderTemplate('service.authenticator.ts', names, `${names.kebabName}.service.ts`);
      break;
    case 'EmailAuthenticator':
      generator
        .renderTemplate('service.email-authenticator.ts', names, `${names.kebabName}.service.ts`);
      break;
  }

  generator.updateFile('index.ts', content => {
    switch (type) {
      case 'Empty':
      case 'Authenticator':
      case 'EmailAuthenticator':
        content += `export { ${names.upperFirstCamelName} } from './${names.kebabName}.service';\n`;
        break;
      case 'ResourceCollection':
      case 'EntityResourceCollection':
        content += `export { ${names.upperFirstCamelName}Collection }`;
        content += ` from './${names.kebabName}-collection.service';\n`;
        break;
      case 'GraphQLResolver':
        content += `export { ${names.upperFirstCamelName}Resolver } from './${names.kebabName}-resolver.service';\n`;
        break;
    }
    return content;
  });

}
