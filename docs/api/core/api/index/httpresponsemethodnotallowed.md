# Table of contents

* [HttpResponseMethodNotAllowed][ClassDeclaration-17]
    * Constructor
        * [constructor(body, options)][Constructor-17]
    * Properties
        * [isHttpResponseMethodNotAllowed][PropertyDeclaration-40]
        * [statusCode][PropertyDeclaration-41]
        * [statusMessage][PropertyDeclaration-42]

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

[ClassDeclaration-17]: httpresponsemethodnotallowed.md#httpresponsemethodnotallowed
[Constructor-17]: httpresponsemethodnotallowed.md#constructorbody-options
[PropertyDeclaration-40]: httpresponsemethodnotallowed.md#ishttpresponsemethodnotallowed
[PropertyDeclaration-41]: httpresponsemethodnotallowed.md#statuscode
[PropertyDeclaration-42]: httpresponsemethodnotallowed.md#statusmessage