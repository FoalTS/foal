# OpenAPI & Swagger UI

## Introduction

**OpenAPI Specification** (formerly known as Swagger Specification) is an API description format for REST APIs. An OpenAPI *document* allows developers to describe entirely an API.

**Swagger UI** is a graphical interface to visualize and interact with the API’s resources. It is automatically generated from one or several OpenAPI documents.

*[Example of OpenAPI document and Swagger Visualisation](https://editor.swagger.io/)*

## OpenAPI

### The Basics

API Metadata

Describe the api with @ApiOperation

The other decorators

### Don't Repeat Yourself and Take Advantage of the SubControllers

@ApiOperation forbidden

Example with:
- deprecated
- parameter (comment on s'en sort finalement ?)

### Generate the document(s)

`createOpenApiDocument` is the core function used to generate an OpenAPI document.

// Shell Script
// Or Swagger UI

#### Generate and Save a Specification File from the Command Line

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

#### Errors

1. Not the API info
2. Conflicted paths

## Swagger UI

```
npm install @foal/swagger
```

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

### Several APIs or Versions

![Example of several versions](./swagger3.png)

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

## Decorators

| Root Controller | Controllers / Methods | Methods |
| --- |  --- |  --- | 
| `@ApiInfo` | `@ApiServer` | `@ApiOperation` |
| | `@ApiSecurityRequirement` | `@ApiRequestBody` |
| | `@ApiDefineTag` | |
| | `@ApiExternalDoc` | |
| | `@ApiUseTag` | |
| | `@ApiParameter` | |
| | `@ApiResponse` | |
| | `@ApiCallback` | |
| | `@ApiDeprecated` | |
| | `@ApiDefineSchema` | |
| | `@ApiDefineResponse` | |
| | `@ApiDefineParameter` | |
| | `@ApiDefineExample` | |
| | `@ApiDefineRequestBody` | |
| | `@ApiDefineHeader` | |
| | `@ApiDefineSecurityScheme` | |
| | `@ApiDefineLink` | |
| | `@ApiDefineCallback` | |

## Advanced

### In-Depth Overview

- Explain that the operation are gathered under the same path
- The Root Controller and The Decorators `@ApiServer`, `@ApiSecurity` & `@ApiExternalDocs`

### Best Practices with Sub-Controlling

If on sub-controller, use @ApiDefine & @Api($ref)

### Testing the Documentation

## A Complete Example