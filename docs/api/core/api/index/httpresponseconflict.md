# Table of contents

* [HttpResponseConflict][ClassDeclaration-17]
    * Constructor
        * [constructor(body)][Constructor-17]
    * Properties
        * [isHttpResponseConflict][PropertyDeclaration-39]
        * [statusCode][PropertyDeclaration-40]
        * [statusMessage][PropertyDeclaration-41]

# HttpResponseConflict

Represent an HTTP response with the status 409 - CONFLICT.

```typescript
class HttpResponseConflict
```
## Constructor

### constructor(body)

Create an instance of HttpResponseConflict.

```typescript
public constructor(body?: any);
```

**Parameters**

| Name | Type | Description                      |
| ---- | ---- | -------------------------------- |
| body | any  | - Optional body of the response. |

## Properties

### isHttpResponseConflict

Property used internally by isHttpResponseConflict.

```typescript
public readonly isHttpResponseConflict: true;
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

[ClassDeclaration-17]: httpresponseconflict.md#httpresponseconflict
[Constructor-17]: httpresponseconflict.md#constructorbody
[PropertyDeclaration-39]: httpresponseconflict.md#ishttpresponseconflict
[PropertyDeclaration-40]: httpresponseconflict.md#statuscode
[PropertyDeclaration-41]: httpresponseconflict.md#statusmessage