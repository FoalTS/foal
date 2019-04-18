# Table of contents

* [HttpResponseServerError][ClassDeclaration-18]
    * Constructor
        * [constructor(body, options)][Constructor-18]
    * Properties
        * [isHttpResponseServerError][PropertyDeclaration-43]

# HttpResponseServerError

Represent an HTTP response with a server error status 5xx.

```typescript
abstract class HttpResponseServerError
```
## Constructor

### constructor(body, options)

```typescript
public constructor(body?: any, options: { stream?: boolean | undefined; } = {});
```

**Parameters**

| Name    | Type                                   | Default value |
| ------- | -------------------------------------- | ------------- |
| body    | any                                    |               |
| options | { stream?: boolean &#124; undefined; } | {}            |

## Properties

### isHttpResponseServerError

Property used internally by isHttpResponseServerError.

```typescript
public readonly isHttpResponseServerError: true;
```

**Type**

true

[ClassDeclaration-18]: httpresponseservererror.md#httpresponseservererror
[Constructor-18]: httpresponseservererror.md#constructorbody-options
[PropertyDeclaration-43]: httpresponseservererror.md#ishttpresponseservererror