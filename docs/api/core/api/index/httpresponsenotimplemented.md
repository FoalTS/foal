# Table of contents

* [HttpResponseNotImplemented][ClassDeclaration-20]
    * Constructor
        * [constructor(body)][Constructor-20]
    * Properties
        * [isHttpResponseNotImplemented][PropertyDeclaration-46]
        * [statusCode][PropertyDeclaration-47]
        * [statusMessage][PropertyDeclaration-48]

# HttpResponseNotImplemented

Represent an HTTP response with the status 501 - NOT IMPLEMENTED.

```typescript
class HttpResponseNotImplemented
```
## Constructor

### constructor(body)

Create an instance of HttpResponseNotImplemented.

```typescript
public constructor(body?: any);
```

**Parameters**

| Name | Type | Description                      |
| ---- | ---- | -------------------------------- |
| body | any  | - Optional body of the response. |

## Properties

### isHttpResponseNotImplemented

Property used internally by isHttpResponseNotImplemented.

```typescript
public readonly isHttpResponseNotImplemented: true;
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

[ClassDeclaration-20]: httpresponsenotimplemented.md#httpresponsenotimplemented
[Constructor-20]: httpresponsenotimplemented.md#constructorbody
[PropertyDeclaration-46]: httpresponsenotimplemented.md#ishttpresponsenotimplemented
[PropertyDeclaration-47]: httpresponsenotimplemented.md#statuscode
[PropertyDeclaration-48]: httpresponsenotimplemented.md#statusmessage