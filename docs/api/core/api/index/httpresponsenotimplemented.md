# Table of contents

* [HttpResponseNotImplemented][ClassDeclaration-21]
    * Constructor
        * [constructor(body, options)][Constructor-21]
    * Properties
        * [isHttpResponseNotImplemented][PropertyDeclaration-50]
        * [statusCode][PropertyDeclaration-51]
        * [statusMessage][PropertyDeclaration-52]

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

[ClassDeclaration-21]: httpresponsenotimplemented.md#httpresponsenotimplemented
[Constructor-21]: httpresponsenotimplemented.md#constructorbody-options
[PropertyDeclaration-50]: httpresponsenotimplemented.md#ishttpresponsenotimplemented
[PropertyDeclaration-51]: httpresponsenotimplemented.md#statuscode
[PropertyDeclaration-52]: httpresponsenotimplemented.md#statusmessage