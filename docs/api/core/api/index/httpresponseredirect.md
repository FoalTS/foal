# Table of contents

* [HttpResponseRedirect][ClassDeclaration-10]
    * Constructor
        * [constructor(path, body, options)][Constructor-10]
    * Properties
        * [isHttpResponseRedirect][PropertyDeclaration-21]
        * [statusCode][PropertyDeclaration-22]
        * [statusMessage][PropertyDeclaration-23]

# HttpResponseRedirect

Represent an HTTP response with the status 302 - FOUND.

```typescript
class HttpResponseRedirect
```
## Constructor

### constructor(path, body, options)

Create an instance of HttpResponseRedirect.

```typescript
public constructor(path: string, body?: any, options: { stream?: boolean | undefined; } = {});
```

**Parameters**

| Name    | Type                                   | Default value | Description                      |
| ------- | -------------------------------------- | ------------- | -------------------------------- |
| path    | string                                 |               | - The redirection path.          |
| body    | any                                    |               | - Optional body of the response. |
| options | { stream?: boolean &#124; undefined; } | {}            |                                  |

## Properties

### isHttpResponseRedirect

Property used internally by isHttpResponseRedirect.

```typescript
public readonly isHttpResponseRedirect: true;
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

[ClassDeclaration-10]: httpresponseredirect.md#httpresponseredirect
[Constructor-10]: httpresponseredirect.md#constructorpath-body-options
[PropertyDeclaration-21]: httpresponseredirect.md#ishttpresponseredirect
[PropertyDeclaration-22]: httpresponseredirect.md#statuscode
[PropertyDeclaration-23]: httpresponseredirect.md#statusmessage