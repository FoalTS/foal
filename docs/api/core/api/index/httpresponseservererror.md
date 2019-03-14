# Table of contents

* [HttpResponseServerError][ClassDeclaration-18]
    * Constructor
        * [constructor(body)][Constructor-18]
    * Properties
        * [isHttpResponseServerError][PropertyDeclaration-42]

# HttpResponseServerError

Represent an HTTP response with a server error status 5xx.

```typescript
abstract class HttpResponseServerError
```
## Constructor

### constructor(body)

```typescript
public constructor(body?: any);
```

**Parameters**

| Name | Type |
| ---- | ---- |
| body | any  |

## Properties

### isHttpResponseServerError

Property used internally by isHttpResponseServerError.

```typescript
public readonly isHttpResponseServerError: true;
```

**Type**

true

[ClassDeclaration-18]: httpresponseservererror.md#httpresponseservererror
[Constructor-18]: httpresponseservererror.md#constructorbody
[PropertyDeclaration-42]: httpresponseservererror.md#ishttpresponseservererror