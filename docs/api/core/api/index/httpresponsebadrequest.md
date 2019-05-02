# Table of contents

* [HttpResponseBadRequest][ClassDeclaration-13]
    * Constructor
        * [constructor(body, options)][Constructor-13]
    * Properties
        * [isHttpResponseBadRequest][PropertyDeclaration-28]
        * [statusCode][PropertyDeclaration-29]
        * [statusMessage][PropertyDeclaration-30]

# HttpResponseBadRequest

Represent an HTTP response with the status 400 - BAD REQUEST.

```typescript
class HttpResponseBadRequest
```
## Constructor

### constructor(body, options)

Create an instance of HttpResponseBadRequest.

```typescript
public constructor(body?: any, options: { stream?: boolean | undefined; } = {});
```

**Parameters**

| Name    | Type                                   | Default value | Description                      |
| ------- | -------------------------------------- | ------------- | -------------------------------- |
| body    | any                                    |               | - Optional body of the response. |
| options | { stream?: boolean &#124; undefined; } | {}            |                                  |

## Properties

### isHttpResponseBadRequest

Property used internally by isHttpResponseBadRequest.

```typescript
public readonly isHttpResponseBadRequest: true;
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

[ClassDeclaration-13]: httpresponsebadrequest.md#httpresponsebadrequest
[Constructor-13]: httpresponsebadrequest.md#constructorbody-options
[PropertyDeclaration-28]: httpresponsebadrequest.md#ishttpresponsebadrequest
[PropertyDeclaration-29]: httpresponsebadrequest.md#statuscode
[PropertyDeclaration-30]: httpresponsebadrequest.md#statusmessage