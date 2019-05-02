# Table of contents

* [SwaggerController][ClassDeclaration-0]
    * Methods
        * [getOpenApiDefinition(ctx)][MethodDeclaration-0]
        * [index(ctx)][MethodDeclaration-1]
        * [swaggerUi()][MethodDeclaration-2]
        * [swaggerUiBundle()][MethodDeclaration-3]
        * [swaggerUiStandalonePreset()][MethodDeclaration-4]
    * Properties
        * [options][PropertyDeclaration-0]

# SwaggerController

Serve Swagger UI to visualize and interact with API resources.

```typescript
abstract class SwaggerController
```
## Methods

### getOpenApiDefinition(ctx)

```typescript
public getOpenApiDefinition(ctx: Context<any>): HttpResponseNotFound | HttpResponseOK | HttpResponseBadRequest;
```

**Parameters**

| Name | Type         |
| ---- | ------------ |
| ctx  | Context<any> |

**Return type**

HttpResponseNotFound | HttpResponseOK | HttpResponseBadRequest

----------

### index(ctx)

```typescript
public async index(ctx: Context<any>): Promise<HttpResponseOK | HttpResponseMovedPermanently>;
```

**Parameters**

| Name | Type         |
| ---- | ------------ |
| ctx  | Context<any> |

**Return type**

Promise<HttpResponseOK | HttpResponseMovedPermanently>

----------

### swaggerUi()

```typescript
public swaggerUi(): Promise<HttpResponseOK>;
```

**Return type**

Promise<HttpResponseOK>

----------

### swaggerUiBundle()

```typescript
public swaggerUiBundle(): Promise<HttpResponseOK>;
```

**Return type**

Promise<HttpResponseOK>

----------

### swaggerUiStandalonePreset()

```typescript
public swaggerUiStandalonePreset(): Promise<HttpResponseOK>;
```

**Return type**

Promise<HttpResponseOK>

## Properties

### options

Specify the OpenAPI Specification(s) and their location(s).

If a controller class is provided, then an OpenAPI Specification is generated
from its definition.

```typescript
public abstract options: { url: string; } | { controllerClass: Class; } | ({ name: string; url: string; primary?: boolean | undefined; } | { name: string; controllerClass: Class; primary?: boolean | undefined; })[];
```

**Type**

{ url: string; } | { controllerClass: Class; } | ({ name: string; url: string; primary?: boolean | undefined; } | { name: string; controllerClass: Class; primary?: boolean | undefined; })[]

[ClassDeclaration-0]: swaggercontroller.md#swaggercontroller
[MethodDeclaration-0]: swaggercontroller.md#getopenapidefinitionctx
[MethodDeclaration-1]: swaggercontroller.md#indexctx
[MethodDeclaration-2]: swaggercontroller.md#swaggerui
[MethodDeclaration-3]: swaggercontroller.md#swaggeruibundle
[MethodDeclaration-4]: swaggercontroller.md#swaggeruistandalonepreset
[PropertyDeclaration-0]: swaggercontroller.md#options