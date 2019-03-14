# Table of contents

* [HttpResponseOK][ClassDeclaration-4]
    * Constructor
        * [constructor(body)][Constructor-4]
    * Properties
        * [isHttpResponseOK][PropertyDeclaration-6]
        * [statusCode][PropertyDeclaration-7]
        * [statusMessage][PropertyDeclaration-8]

# HttpResponseOK

Represent an HTTP response with the status 200 - OK.

```typescript
class HttpResponseOK
```
## Constructor

### constructor(body)

Create an instance of HttpResponseOK.

```typescript
public constructor(body?: any);
```

**Parameters**

| Name | Type | Description                      |
| ---- | ---- | -------------------------------- |
| body | any  | - Optional body of the response. |

## Properties

### isHttpResponseOK

Property used internally by isHttpResponOK.

```typescript
public readonly isHttpResponseOK: true;
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

[ClassDeclaration-4]: httpresponseok.md#httpresponseok
[Constructor-4]: httpresponseok.md#constructorbody
[PropertyDeclaration-6]: httpresponseok.md#ishttpresponseok
[PropertyDeclaration-7]: httpresponseok.md#statuscode
[PropertyDeclaration-8]: httpresponseok.md#statusmessage