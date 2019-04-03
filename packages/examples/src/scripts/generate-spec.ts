// std
import { writeFileSync } from 'fs';

// 3p
import { createOpenApiDocument } from '@foal/core';
import { stringify } from 'yamljs';

// App
import { ApiV1Controller } from '../app/controllers';

export async function main() {
  const document = createOpenApiDocument(ApiV1Controller);
  const yamlDocument = stringify(document);

  writeFileSync('openapi.yml', yamlDocument, 'utf8');
}
