# Table of contents

* [HttpResponseUnauthorized][ClassDeclaration-13]
    * Constructor
        * [constructor(body)][Constructor-13]
    * Properties
        * [isHttpResponseUnauthorized][PropertyDeclaration-27]
        * [statusCode][PropertyDeclaration-28]
        * [statusMessage][PropertyDeclaration-29]

# HttpResponseUnauthorized

Represent an HTTP response with the status 401 - UNAUTHORIZED.

```typescript
class HttpResponseUnauthorized
```
## Constructor

### constructor(body)

Create an instance of HttpResponseUnauthorized.

```typescript
public constructor(body?: any);
```

**Parameters**

| Name | Type | Description                      |
| ---- | ---- | -------------------------------- |
| body | any  | - Optional body of the response. |

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

[ClassDeclaration-13]: httpresponseunauthorized.md#httpresponseunauthorized
[Constructor-13]: httpresponseunauthorized.md#constructorbody
[PropertyDeclaration-27]: httpresponseunauthorized.md#ishttpresponseunauthorized
[PropertyDeclaration-28]: httpresponseunauthorized.md#statuscode
[PropertyDeclaration-29]: httpresponseunauthorized.md#statusmessage