# Table of contents

* [HttpResponseNotImplemented][ClassDeclaration-20]
    * Constructor
        * [constructor(body, options)][Constructor-20]
    * Properties
        * [isHttpResponseNotImplemented][PropertyDeclaration-47]
        * [statusCode][PropertyDeclaration-48]
        * [statusMessage][PropertyDeclaration-49]

# HttpResponseNotImplemented

Represent an HTTP response with the status 501 - NOT IMPLEMENTED.

```typescript
class HttpResponseNotImplemented
```
## Constructor

### constructor(body, options)

Create an instance of HttpResponseNotImplemented.

```typescript
public constructor(body?: any, options: { stream?: boolean | undefined; } = {});
```

**Parameters**

| Name    | Type                                   | Default value | Description                      |
| ------- | -------------------------------------- | ------------- | -------------------------------- |
| body    | any                                    |               | - Optional body of the response. |
| options | { stream?: boolean &#124; undefined; } | {}            |                                  |

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
[Constructor-20]: httpresponsenotimplemented.md#constructorbody-options
[PropertyDeclaration-47]: httpresponsenotimplemented.md#ishttpresponsenotimplemented
[PropertyDeclaration-48]: httpresponsenotimplemented.md#statuscode
[PropertyDeclaration-49]: httpresponsenotimplemented.md#statusmessage