# Table of contents

* [HttpResponseMovedPermanently][ClassDeclaration-10]
    * Constructor
        * [constructor(path)][Constructor-10]
    * Properties
        * [isHttpResponseMovedPermanently][PropertyDeclaration-21]
        * [statusCode][PropertyDeclaration-22]
        * [statusMessage][PropertyDeclaration-23]

# HttpResponseMovedPermanently

Represent an HTTP response with the status 301 - MOVED PERMANENTLY.

```typescript
class HttpResponseMovedPermanently
```
## Constructor

### constructor(path)

Create an instance of HttpResponseMovedPermanently.

```typescript
public constructor(path: string);
```

**Parameters**

| Name | Type   | Description             |
| ---- | ------ | ----------------------- |
| path | string | - The redirection path. |

## Properties

### isHttpResponseMovedPermanently

Property used internally by isHttpResponseMovedPermanently.

```typescript
public readonly isHttpResponseMovedPermanently: true;
```

**Type**

true

----------

### statusCode

Status code of the response.

```typescript
public readonly statusCode: 301;
```

**Type**

301

----------

### statusMessage

Status message of the response. It must follow the HTTP conventions
and be consistent with the statusCode property.

```typescript
public readonly statusMessage: "MOVED PERMANENTLY";
```

**Type**

"MOVED PERMANENTLY"

[ClassDeclaration-10]: httpresponsemovedpermanently.md#httpresponsemovedpermanently
[Constructor-10]: httpresponsemovedpermanently.md#constructorpath
[PropertyDeclaration-21]: httpresponsemovedpermanently.md#ishttpresponsemovedpermanently
[PropertyDeclaration-22]: httpresponsemovedpermanently.md#statuscode
[PropertyDeclaration-23]: httpresponsemovedpermanently.md#statusmessage