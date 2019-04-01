# Table of contents

* [HttpResponseInternalServerError][ClassDeclaration-19]
    * Constructor
        * [constructor(body, options)][Constructor-19]
    * Properties
        * [isHttpResponseInternalServerError][PropertyDeclaration-44]
        * [statusCode][PropertyDeclaration-45]
        * [statusMessage][PropertyDeclaration-46]

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

[ClassDeclaration-19]: httpresponseinternalservererror.md#httpresponseinternalservererror
[Constructor-19]: httpresponseinternalservererror.md#constructorbody-options
[PropertyDeclaration-44]: httpresponseinternalservererror.md#ishttpresponseinternalservererror
[PropertyDeclaration-45]: httpresponseinternalservererror.md#statuscode
[PropertyDeclaration-46]: httpresponseinternalservererror.md#statusmessage