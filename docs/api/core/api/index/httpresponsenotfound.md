# Table of contents

* [HttpResponseNotFound][ClassDeclaration-15]
    * Constructor
        * [constructor(body)][Constructor-15]
    * Properties
        * [isHttpResponseNotFound][PropertyDeclaration-33]
        * [statusCode][PropertyDeclaration-34]
        * [statusMessage][PropertyDeclaration-35]

# HttpResponseNotFound

Represent an HTTP response with the status 404 - NOT FOUND.

```typescript
class HttpResponseNotFound
```
## Constructor

### constructor(body)

Create an instance of HttpResponseNotFound.

```typescript
public constructor(body?: any);
```

**Parameters**

| Name | Type | Description                      |
| ---- | ---- | -------------------------------- |
| body | any  | - Optional body of the response. |

## Properties

### isHttpResponseNotFound

Property used internally by isHttpResponseNotFound.

```typescript
public readonly isHttpResponseNotFound: true;
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

[ClassDeclaration-15]: httpresponsenotfound.md#httpresponsenotfound
[Constructor-15]: httpresponsenotfound.md#constructorbody
[PropertyDeclaration-33]: httpresponsenotfound.md#ishttpresponsenotfound
[PropertyDeclaration-34]: httpresponsenotfound.md#statuscode
[PropertyDeclaration-35]: httpresponsenotfound.md#statusmessage