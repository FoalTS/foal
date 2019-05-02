# Table of contents

* [HttpResponseNotFound][ClassDeclaration-16]
    * Constructor
        * [constructor(body, options)][Constructor-16]
    * Properties
        * [isHttpResponseNotFound][PropertyDeclaration-37]
        * [statusCode][PropertyDeclaration-38]
        * [statusMessage][PropertyDeclaration-39]

# HttpResponseNotFound

Represent an HTTP response with the status 404 - NOT FOUND.

```typescript
class HttpResponseNotFound
```
## Constructor

### constructor(body, options)

Create an instance of HttpResponseNotFound.

```typescript
public constructor(body?: any, options: { stream?: boolean | undefined; } = {});
```

**Parameters**

| Name    | Type                                   | Default value | Description                      |
| ------- | -------------------------------------- | ------------- | -------------------------------- |
| body    | any                                    |               | - Optional body of the response. |
| options | { stream?: boolean &#124; undefined; } | {}            |                                  |

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

[ClassDeclaration-16]: httpresponsenotfound.md#httpresponsenotfound
[Constructor-16]: httpresponsenotfound.md#constructorbody-options
[PropertyDeclaration-37]: httpresponsenotfound.md#ishttpresponsenotfound
[PropertyDeclaration-38]: httpresponsenotfound.md#statuscode
[PropertyDeclaration-39]: httpresponsenotfound.md#statusmessage