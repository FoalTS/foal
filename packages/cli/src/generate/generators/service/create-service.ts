// std
import { existsSync, readFileSync } from 'fs';

// FoalTS
import { getNames, renderTemplate, updateFile } from '../../utils';

export type ServiceType = 'Empty'|'ResourceCollection'|'EntityResourceCollection'|'GraphQLResolver'
  |'Authenticator'|'EmailAuthenticator';

export function createService({ name, type }: { name: string, type: ServiceType }) {
  const names = getNames(name);

  let prefix = '';
  let indexPath = 'index.ts';

  if (existsSync('src/app/services')) {
    prefix = 'src/app/services/';
    indexPath = `src/app/services/${indexPath}`;
  } else if (existsSync('services')) {
    prefix = 'services/';
    indexPath = `services/${indexPath}`;
  }

  switch (type) {
    case 'Empty':
      renderTemplate('service/service.empty.ts', `${prefix}${names.kebabName}.service.ts`, names);
      break;
    case 'ResourceCollection':
      renderTemplate(
        'service/service.resource-collection.ts',
        `${prefix}${names.kebabName}-collection.service.ts`, names
      );
      break;
    case 'EntityResourceCollection':
      renderTemplate(
        'service/service.entity-resource-collection.ts',
        `${prefix}${names.kebabName}-collection.service.ts`,
        names
      );
      break;
    case 'GraphQLResolver':
      renderTemplate('service/service.graphql-resolver.ts', `${prefix}${names.kebabName}-resolver.service.ts`, names);
      break;
    case 'Authenticator':
      renderTemplate('service/service.authenticator.ts', `${prefix}${names.kebabName}.service.ts`, names);
      break;
    case 'EmailAuthenticator':
      renderTemplate('service/service.email-authenticator.ts', `${prefix}${names.kebabName}.service.ts`, names);
      break;
  }

  updateFile(indexPath, content => {
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
