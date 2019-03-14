# Table of contents

* [HttpResponseMethodNotAllowed][ClassDeclaration-16]
    * Constructor
        * [constructor(body)][Constructor-16]
    * Properties
        * [isHttpResponseMethodNotAllowed][PropertyDeclaration-36]
        * [statusCode][PropertyDeclaration-37]
        * [statusMessage][PropertyDeclaration-38]

# HttpResponseMethodNotAllowed

Represent an HTTP response with the status 405 - METHOD NOT ALLOWED.

```typescript
class HttpResponseMethodNotAllowed
```
## Constructor

### constructor(body)

Create an instance of HttpResponseMethodNotAllowed.

```typescript
public constructor(body?: any);
```

**Parameters**

| Name | Type | Description                      |
| ---- | ---- | -------------------------------- |
| body | any  | - Optional body of the response. |

## Properties

### isHttpResponseMethodNotAllowed

Property used internally by isHttpResponseMethodNotAllowed.

```typescript
public readonly isHttpResponseMethodNotAllowed: true;
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

[ClassDeclaration-16]: httpresponsemethodnotallowed.md#httpresponsemethodnotallowed
[Constructor-16]: httpresponsemethodnotallowed.md#constructorbody
[PropertyDeclaration-36]: httpresponsemethodnotallowed.md#ishttpresponsemethodnotallowed
[PropertyDeclaration-37]: httpresponsemethodnotallowed.md#statuscode
[PropertyDeclaration-38]: httpresponsemethodnotallowed.md#statusmessage