// std
import { existsSync } from 'fs';

// FoalTS
import { getNames, renderTemplate } from '../../utils';

export type ServiceType = 'Empty'|'ResourceCollection'|'EntityResourceCollection'|'GraphQLResolver'
  |'Authenticator'|'EmailAuthenticator';

export function createService({ name, type }: { name: string, type: ServiceType }) {
  const names = getNames(name);

  let prefix = '';

  if (existsSync('src/app/services')) {
    prefix = 'src/app/services/';
  } else if (existsSync('services')) {
    prefix = 'services/';
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

}
