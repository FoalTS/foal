import { getNames, renderTemplate } from '../../utils';

export type ServiceType = 'Empty'|'Serializer'|'EntitySerializer'|'GraphQLResolver'
  |'Authenticator'|'EmailAuthenticator';

export function createService({ name, type }: { name: string, type: ServiceType }) {
  const names = getNames(name);

  switch (type) {
    case 'Empty':
      renderTemplate('service/service.empty.ts', `${names.kebabName}.service.ts`, names);
      break;
    case 'Serializer':
      renderTemplate('service/service.serializer.ts', `${names.kebabName}-serializer.service.ts`, names);
      break;
    case 'EntitySerializer':
      renderTemplate('service/service.entity-serializer.ts', `${names.kebabName}-serializer.service.ts`, names);
      break;
    case 'GraphQLResolver':
      renderTemplate('service/service.graphql-resolver.ts', `${names.kebabName}-resolver.service.ts`, names);
      break;
    case 'Authenticator':
      renderTemplate('service/service.authenticator.ts', `${names.kebabName}.service.ts`, names);
      break;
    case 'EmailAuthenticator':
      renderTemplate('service/service.email-authenticator.ts', `${names.kebabName}.service.ts`, names);
      break;
  }

}
