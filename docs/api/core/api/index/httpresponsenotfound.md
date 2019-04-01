# Table of contents

* [HttpResponseNotFound][ClassDeclaration-15]
    * Constructor
        * [constructor(body, options)][Constructor-15]
    * Properties
        * [isHttpResponseNotFound][PropertyDeclaration-34]
        * [statusCode][PropertyDeclaration-35]
        * [statusMessage][PropertyDeclaration-36]

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

[ClassDeclaration-15]: httpresponsenotfound.md#httpresponsenotfound
[Constructor-15]: httpresponsenotfound.md#constructorbody-options
[PropertyDeclaration-34]: httpresponsenotfound.md#ishttpresponsenotfound
[PropertyDeclaration-35]: httpresponsenotfound.md#statuscode
[PropertyDeclaration-36]: httpresponsenotfound.md#statusmessage