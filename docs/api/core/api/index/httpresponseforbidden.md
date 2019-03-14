# Table of contents

* [HttpResponseForbidden][ClassDeclaration-14]
    * Constructor
        * [constructor(body)][Constructor-14]
    * Properties
        * [isHttpResponseForbidden][PropertyDeclaration-30]
        * [statusCode][PropertyDeclaration-31]
        * [statusMessage][PropertyDeclaration-32]

# HttpResponseForbidden

Represent an HTTP response with the status 403 - FORBIDDEN.

```typescript
class HttpResponseForbidden
```
## Constructor

### constructor(body)

Create an instance of HttpResponseForbidden.

```typescript
public constructor(body?: any);
```

**Parameters**

| Name | Type | Description                      |
| ---- | ---- | -------------------------------- |
| body | any  | - Optional body of the response. |

## Properties

### isHttpResponseForbidden

Property used internally by isHttpResponseForbidden.

```typescript
public readonly isHttpResponseForbidden: true;
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

[ClassDeclaration-14]: httpresponseforbidden.md#httpresponseforbidden
[Constructor-14]: httpresponseforbidden.md#constructorbody
[PropertyDeclaration-30]: httpresponseforbidden.md#ishttpresponseforbidden
[PropertyDeclaration-31]: httpresponseforbidden.md#statuscode
[PropertyDeclaration-32]: httpresponseforbidden.md#statusmessage