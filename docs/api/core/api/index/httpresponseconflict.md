# Table of contents

* [HttpResponseConflict][ClassDeclaration-18]
    * Constructor
        * [constructor(body, options)][Constructor-18]
    * Properties
        * [isHttpResponseConflict][PropertyDeclaration-43]
        * [statusCode][PropertyDeclaration-44]
        * [statusMessage][PropertyDeclaration-45]

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

[ClassDeclaration-18]: httpresponseconflict.md#httpresponseconflict
[Constructor-18]: httpresponseconflict.md#constructorbody-options
[PropertyDeclaration-43]: httpresponseconflict.md#ishttpresponseconflict
[PropertyDeclaration-44]: httpresponseconflict.md#statuscode
[PropertyDeclaration-45]: httpresponseconflict.md#statusmessage