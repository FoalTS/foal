# Table of contents

* [HttpResponseMethodNotAllowed][ClassDeclaration-16]
    * Constructor
        * [constructor(body, options)][Constructor-16]
    * Properties
        * [isHttpResponseMethodNotAllowed][PropertyDeclaration-37]
        * [statusCode][PropertyDeclaration-38]
        * [statusMessage][PropertyDeclaration-39]

# HttpResponseMethodNotAllowed

Represent an HTTP response with the status 405 - METHOD NOT ALLOWED.

```typescript
class HttpResponseMethodNotAllowed
```
## Constructor

### constructor(body, options)

Create an instance of HttpResponseMethodNotAllowed.

```typescript
public constructor(body?: any, options: { stream?: boolean | undefined; } = {});
```

**Parameters**

| Name    | Type                                   | Default value | Description                      |
| ------- | -------------------------------------- | ------------- | -------------------------------- |
| body    | any                                    |               | - Optional body of the response. |
| options | { stream?: boolean &#124; undefined; } | {}            |                                  |

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
[Constructor-16]: httpresponsemethodnotallowed.md#constructorbody-options
[PropertyDeclaration-37]: httpresponsemethodnotallowed.md#ishttpresponsemethodnotallowed
[PropertyDeclaration-38]: httpresponsemethodnotallowed.md#statuscode
[PropertyDeclaration-39]: httpresponsemethodnotallowed.md#statusmessage