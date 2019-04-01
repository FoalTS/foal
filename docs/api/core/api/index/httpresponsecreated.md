# Table of contents

* [HttpResponseCreated][ClassDeclaration-7]
    * Constructor
        * [constructor(body, options)][Constructor-7]
    * Properties
        * [isHttpResponseCreated][PropertyDeclaration-14]
        * [statusCode][PropertyDeclaration-15]
        * [statusMessage][PropertyDeclaration-16]

# HttpResponseCreated

Represent an HTTP response with the status 201 - CREATED.

```typescript
class HttpResponseCreated
```
## Constructor

### constructor(body, options)

Create an instance of HttpResponseCreated.

```typescript
public constructor(body?: any, options: { stream?: boolean | undefined; } = {});
```

**Parameters**

| Name    | Type                                   | Default value | Description                      |
| ------- | -------------------------------------- | ------------- | -------------------------------- |
| body    | any                                    |               | - Optional body of the response. |
| options | { stream?: boolean &#124; undefined; } | {}            |                                  |

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
[Constructor-7]: httpresponsecreated.md#constructorbody-options
[PropertyDeclaration-14]: httpresponsecreated.md#ishttpresponsecreated
[PropertyDeclaration-15]: httpresponsecreated.md#statuscode
[PropertyDeclaration-16]: httpresponsecreated.md#statusmessage