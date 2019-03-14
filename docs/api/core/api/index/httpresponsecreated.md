# Table of contents

* [HttpResponseCreated][ClassDeclaration-7]
    * Constructor
        * [constructor(body)][Constructor-7]
    * Properties
        * [isHttpResponseCreated][PropertyDeclaration-13]
        * [statusCode][PropertyDeclaration-14]
        * [statusMessage][PropertyDeclaration-15]

# HttpResponseCreated

Represent an HTTP response with the status 201 - CREATED.

```typescript
class HttpResponseCreated
```
## Constructor

### constructor(body)

Create an instance of HttpResponseCreated.

```typescript
public constructor(body?: any);
```

**Parameters**

| Name | Type | Description                      |
| ---- | ---- | -------------------------------- |
| body | any  | - Optional body of the response. |

## Properties

### isHttpResponseCreated

Property used internally by isHttpResponseCreated.

```typescript
public readonly isHttpResponseCreated: true;
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

[ClassDeclaration-7]: httpresponsecreated.md#httpresponsecreated
[Constructor-7]: httpresponsecreated.md#constructorbody
[PropertyDeclaration-13]: httpresponsecreated.md#ishttpresponsecreated
[PropertyDeclaration-14]: httpresponsecreated.md#statuscode
[PropertyDeclaration-15]: httpresponsecreated.md#statusmessage