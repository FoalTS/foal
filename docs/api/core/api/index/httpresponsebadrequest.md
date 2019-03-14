# Table of contents

* [HttpResponseBadRequest][ClassDeclaration-12]
    * Constructor
        * [constructor(body)][Constructor-12]
    * Properties
        * [isHttpResponseBadRequest][PropertyDeclaration-24]
        * [statusCode][PropertyDeclaration-25]
        * [statusMessage][PropertyDeclaration-26]

# HttpResponseBadRequest

Represent an HTTP response with the status 400 - BAD REQUEST.

```typescript
class HttpResponseBadRequest
```
## Constructor

### constructor(body)

Create an instance of HttpResponseBadRequest.

```typescript
public constructor(body?: any);
```

**Parameters**

| Name | Type | Description                      |
| ---- | ---- | -------------------------------- |
| body | any  | - Optional body of the response. |

## Properties

### isHttpResponseBadRequest

Property used internally by isHttpResponseBadRequest.

```typescript
public readonly isHttpResponseBadRequest: true;
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

[ClassDeclaration-12]: httpresponsebadrequest.md#httpresponsebadrequest
[Constructor-12]: httpresponsebadrequest.md#constructorbody
[PropertyDeclaration-24]: httpresponsebadrequest.md#ishttpresponsebadrequest
[PropertyDeclaration-25]: httpresponsebadrequest.md#statuscode
[PropertyDeclaration-26]: httpresponsebadrequest.md#statusmessage