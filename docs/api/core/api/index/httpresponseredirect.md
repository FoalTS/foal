# Table of contents

* [HttpResponseRedirect][ClassDeclaration-10]
    * Constructor
        * [constructor(path, body)][Constructor-10]
    * Properties
        * [isHttpResponseRedirect][PropertyDeclaration-20]
        * [statusCode][PropertyDeclaration-21]
        * [statusMessage][PropertyDeclaration-22]

# HttpResponseRedirect

Represent an HTTP response with the status 302 - FOUND.

```typescript
class HttpResponseRedirect
```
## Constructor

### constructor(path, body)

Create an instance of HttpResponseRedirect.

```typescript
public constructor(path: string, body?: any);
```

**Parameters**

| Name | Type   | Description                      |
| ---- | ------ | -------------------------------- |
| path | string | - The redirection path.          |
| body | any    | - Optional body of the response. |

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
[Constructor-10]: httpresponseredirect.md#constructorpath-body
[PropertyDeclaration-20]: httpresponseredirect.md#ishttpresponseredirect
[PropertyDeclaration-21]: httpresponseredirect.md#statuscode
[PropertyDeclaration-22]: httpresponseredirect.md#statusmessage