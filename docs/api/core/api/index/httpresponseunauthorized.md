# Table of contents

* [HttpResponseUnauthorized][ClassDeclaration-14]
    * Constructor
        * [constructor(body, options)][Constructor-14]
    * Properties
        * [isHttpResponseUnauthorized][PropertyDeclaration-31]
        * [statusCode][PropertyDeclaration-32]
        * [statusMessage][PropertyDeclaration-33]

# HttpResponseUnauthorized

Represent an HTTP response with the status 401 - UNAUTHORIZED.

```typescript
class HttpResponseUnauthorized
```
## Constructor

### constructor(body, options)

Create an instance of HttpResponseUnauthorized.

```typescript
public constructor(body?: any, options: { stream?: boolean | undefined; } = {});
```

**Parameters**

| Name    | Type                                   | Default value | Description                      |
| ------- | -------------------------------------- | ------------- | -------------------------------- |
| body    | any                                    |               | - Optional body of the response. |
| options | { stream?: boolean &#124; undefined; } | {}            |                                  |

## Properties

### isHttpResponseUnauthorized

Property used internally by isHttpResponseUnauthorized.

```typescript
public readonly isHttpResponseUnauthorized: true;
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

[ClassDeclaration-14]: httpresponseunauthorized.md#httpresponseunauthorized
[Constructor-14]: httpresponseunauthorized.md#constructorbody-options
[PropertyDeclaration-31]: httpresponseunauthorized.md#ishttpresponseunauthorized
[PropertyDeclaration-32]: httpresponseunauthorized.md#statuscode
[PropertyDeclaration-33]: httpresponseunauthorized.md#statusmessage