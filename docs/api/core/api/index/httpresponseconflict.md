# Table of contents

* [HttpResponseConflict][ClassDeclaration-17]
    * Constructor
        * [constructor(body, options)][Constructor-17]
    * Properties
        * [isHttpResponseConflict][PropertyDeclaration-40]
        * [statusCode][PropertyDeclaration-41]
        * [statusMessage][PropertyDeclaration-42]

# HttpResponseConflict

Represent an HTTP response with the status 409 - CONFLICT.

```typescript
class HttpResponseConflict
```
## Constructor

### constructor(body, options)

Create an instance of HttpResponseConflict.

```typescript
public constructor(body?: any, options: { stream?: boolean | undefined; } = {});
```

**Parameters**

| Name    | Type                                   | Default value | Description                      |
| ------- | -------------------------------------- | ------------- | -------------------------------- |
| body    | any                                    |               | - Optional body of the response. |
| options | { stream?: boolean &#124; undefined; } | {}            |                                  |

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
[Constructor-17]: httpresponseconflict.md#constructorbody-options
[PropertyDeclaration-40]: httpresponseconflict.md#ishttpresponseconflict
[PropertyDeclaration-41]: httpresponseconflict.md#statuscode
[PropertyDeclaration-42]: httpresponseconflict.md#statusmessage