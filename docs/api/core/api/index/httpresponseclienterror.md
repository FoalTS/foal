# Table of contents

* [HttpResponseClientError][ClassDeclaration-11]
    * Constructor
        * [constructor(body)][Constructor-11]
    * Properties
        * [isHttpResponseClientError][PropertyDeclaration-23]

# HttpResponseClientError

Represent an HTTP response with a client error status 4xx.

```typescript
abstract class HttpResponseClientError
```
## Constructor

### constructor(body)

Create an instance of HttpResponseClientError.

```typescript
public constructor(body?: any);
```

**Parameters**

| Name | Type | Description                      |
| ---- | ---- | -------------------------------- |
| body | any  | - Optional body of the response. |

## Properties

### isHttpResponseClientError

Property used internally by isHttpResponseClientError.

```typescript
public readonly isHttpResponseClientError: true;
```

**Type**

true

[ClassDeclaration-11]: httpresponseclienterror.md#httpresponseclienterror
[Constructor-11]: httpresponseclienterror.md#constructorbody
[PropertyDeclaration-23]: httpresponseclienterror.md#ishttpresponseclienterror