# Table of contents

* [HttpResponseInternalServerError][ClassDeclaration-19]
    * Constructor
        * [constructor(body)][Constructor-19]
    * Properties
        * [isHttpResponseInternalServerError][PropertyDeclaration-43]
        * [statusCode][PropertyDeclaration-44]
        * [statusMessage][PropertyDeclaration-45]

# HttpResponseInternalServerError

Represent an HTTP response with the status 500 - INTERNAL SERVER ERROR.

```typescript
class HttpResponseInternalServerError
```
## Constructor

### constructor(body)

Create an instance of HttpResponseInternalServerError.

```typescript
public constructor(body?: any);
```

**Parameters**

| Name | Type | Description                      |
| ---- | ---- | -------------------------------- |
| body | any  | - Optional body of the response. |

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

[ClassDeclaration-19]: httpresponseinternalservererror.md#httpresponseinternalservererror
[Constructor-19]: httpresponseinternalservererror.md#constructorbody
[PropertyDeclaration-43]: httpresponseinternalservererror.md#ishttpresponseinternalservererror
[PropertyDeclaration-44]: httpresponseinternalservererror.md#statuscode
[PropertyDeclaration-45]: httpresponseinternalservererror.md#statusmessage