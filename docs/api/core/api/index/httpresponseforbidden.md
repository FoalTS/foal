# Table of contents

* [HttpResponseForbidden][ClassDeclaration-15]
    * Constructor
        * [constructor(body, options)][Constructor-15]
    * Properties
        * [isHttpResponseForbidden][PropertyDeclaration-34]
        * [statusCode][PropertyDeclaration-35]
        * [statusMessage][PropertyDeclaration-36]

# HttpResponseForbidden

Represent an HTTP response with the status 403 - FORBIDDEN.

```typescript
class HttpResponseForbidden
```
## Constructor

### constructor(body, options)

Create an instance of HttpResponseForbidden.

```typescript
public constructor(body?: any, options: { stream?: boolean | undefined; } = {});
```

**Parameters**

| Name    | Type                                   | Default value | Description                      |
| ------- | -------------------------------------- | ------------- | -------------------------------- |
| body    | any                                    |               | - Optional body of the response. |
| options | { stream?: boolean &#124; undefined; } | {}            |                                  |

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

[ClassDeclaration-15]: httpresponseforbidden.md#httpresponseforbidden
[Constructor-15]: httpresponseforbidden.md#constructorbody-options
[PropertyDeclaration-34]: httpresponseforbidden.md#ishttpresponseforbidden
[PropertyDeclaration-35]: httpresponseforbidden.md#statuscode
[PropertyDeclaration-36]: httpresponseforbidden.md#statusmessage