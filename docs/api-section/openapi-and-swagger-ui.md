# OpenAPI & Swagger UI

## Swagger UI - A Graphical Interface to Visualize And interact with the API’s Resources

![Swagger 1](./swagger1.png)
![Swagger 2](./swagger2.png)

### Simple case

```typescript
import { SwaggerController } from '@foal/swagger';

import { ApiController } from './api.controller';

export class OpenApiController extends SwaggerController {
  options = { controllerClass: ApiController };
}

```

### Url

```typescript
import { SwaggerController } from '@foal/swagger';

export class OpenApiController extends SwaggerController {
  options = { url: 'https://petstore.swagger.io/v2/swagger.json' };
}

```

### Several APIs or versions

![Swagger 3](./swagger3.png)

*app.controller.ts*
```typescript
import { controller } from '@foal/core';

import { ApiV1Controller, ApiV2ontroller, OpenApiController } from './controllers';

export class AppController {
  subControllers = [
    controller('/api', ApiV1Controller),
    controller('/api/v2', ApiV2Controller),
    controller('/swagger', OpenApiController),
  ]
}
```

*open-api.controller.ts*
```typescript
import { SwaggerController } from '@foal/swagger';

import { ApiV1Controller } from './api-v1.controller';
import { ApiV2Controller } from './api-v2.controller';

export class OpenApiController extends SwaggerController {
  options = [
    { name: 'v1', controllerClass: ApiV1Controller },
    { name: 'v2', controllerClass: ApiV2Controller, primary: true },
  ]
}
```

## Generate and Save a Specification File from the Command Line

```typescript
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

```

## Decorators

| Decorator | Root Controller | SubController | Method |
|--|--|--|--|
| `@ApiInfo` | yes | no | no |
| `@ApiServer` | yes | yes | yes |
| `@ApiSecurityRequirement` | yes | yes | yes |
| `@ApiDefineTag` | yes | yes | yes |
| `@ApiExternalDoc` | yes | no | yes |
| `@ApiOperation` | no | no | yes |
| `@ApiUseTag` | yes | yes | yes |
| `@ApiParameter` | yes | yes | yes |
| `@ApiRequestBody` | no | no | yes |
| `@ApiResponse` | yes | yes | yes |
| `@ApiCallback` | yes | yes | yes |
| `@ApiDeprecated` | yes | yes | yes |
| `@ApiDefineSchema` | yes | yes | yes |
| `@ApiDefineResponse` | yes | yes | yes |
| `@ApiDefineParameter` | yes | yes | yes |
| `@ApiDefineExample` | yes | yes | yes |
| `@ApiDefineRequestBody` | yes | yes | yes |
| `@ApiDefineHeader` | yes | yes | yes |
| `@ApiDefineSecurityScheme` | yes | yes | yes |
| `@ApiDefineLink` | yes | yes | yes |
| `@ApiDefineCallback` | yes | yes | yes |

## Examples