# Table of contents

* [HttpResponseInternalServerError][ClassDeclaration-20]
    * Constructor
        * [constructor(body, options)][Constructor-20]
    * Properties
        * [isHttpResponseInternalServerError][PropertyDeclaration-47]
        * [statusCode][PropertyDeclaration-48]
        * [statusMessage][PropertyDeclaration-49]

# HttpResponseInternalServerError

Represent an HTTP response with the status 500 - INTERNAL SERVER ERROR.

```typescript
class HttpResponseInternalServerError
```
## Constructor

### constructor(body, options)

Create an instance of HttpResponseInternalServerError.

```typescript
public constructor(body?: any, options: { stream?: boolean | undefined; } = {});
```

**Parameters**

| Name    | Type                                   | Default value | Description                      |
| ------- | -------------------------------------- | ------------- | -------------------------------- |
| body    | any                                    |               | - Optional body of the response. |
| options | { stream?: boolean &#124; undefined; } | {}            |                                  |

## Properties

### isHttpResponseInternalServerError

Property used internally by isHttpResponseInternalServerError.

```typescript
public readonly isHttpResponseInternalServerError: true;
```

**Type**

true

----------

### statusCode

Status code of the response.

```typescript
public statusCode: number;
```

**Type**

number

----------

### statusMessage

Status message of the response. It must follow the HTTP conventions
and be consistent with the statusCode property.

```typescript
public statusMessage: string;
```

**Type**

string

[ClassDeclaration-20]: httpresponseinternalservererror.md#httpresponseinternalservererror
[Constructor-20]: httpresponseinternalservererror.md#constructorbody-options
[PropertyDeclaration-47]: httpresponseinternalservererror.md#ishttpresponseinternalservererror
[PropertyDeclaration-48]: httpresponseinternalservererror.md#statuscode
[PropertyDeclaration-49]: httpresponseinternalservererror.md#statusmessage