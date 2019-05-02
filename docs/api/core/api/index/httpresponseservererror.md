# Table of contents

* [HttpResponseServerError][ClassDeclaration-19]
    * Constructor
        * [constructor(body, options)][Constructor-19]
    * Properties
        * [isHttpResponseServerError][PropertyDeclaration-46]

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

[ClassDeclaration-19]: httpresponseservererror.md#httpresponseservererror
[Constructor-19]: httpresponseservererror.md#constructorbody-options
[PropertyDeclaration-46]: httpresponseservererror.md#ishttpresponseservererror