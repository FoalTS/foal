---
title: OpenAPI
---

From version 2, the `settings.openapi.useHooks` configuration is enabled by default. This means that when generating the OpenAPI document, FoalTS will use the OpenAPI decorators but also the current hooks to create the document.

## New features

### Validation & OpenAPI schema references

OpenAPI schema references are now supported in validation hooks.

```typescript
import {
  ApiDefineRequestBody,
  Post,
  Put,
  ValidateBody,
} from '@foal/core';

@ApiDefineRequestBody('product', { /* ... */ })
class ProductController {

  @Post('/products')
  @ValidateBody({
    $ref: '#/components/requestBodies/product'
  })
  createProduct(ctx) {
    // ...
  }

  @Put('/products/:id')
  @ValidateBody({
    $ref: '#/components/requestBodies/product'
  })
  replaceProduct(ctx) {
    // ...
  }

}
```
