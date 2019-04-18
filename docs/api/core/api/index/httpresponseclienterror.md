# Table of contents

* [HttpResponseClientError][ClassDeclaration-11]
    * Constructor
        * [constructor(body, options)][Constructor-11]
    * Properties
        * [isHttpResponseClientError][PropertyDeclaration-24]

# HttpResponseClientError

Represent an HTTP response with a client error status 4xx.

```typescript
abstract class HttpResponseClientError
```
## Constructor

### constructor(body, options)

Create an instance of HttpResponseClientError.

```typescript
public constructor(body?: any, options: { stream?: boolean | undefined; } = {});
```

**Parameters**

| Name    | Type                                   | Default value | Description                      |
| ------- | -------------------------------------- | ------------- | -------------------------------- |
| body    | any                                    |               | - Optional body of the response. |
| options | { stream?: boolean &#124; undefined; } | {}            |                                  |

## Properties

### isHttpResponseClientError

Property used internally by isHttpResponseClientError.

```typescript
public readonly isHttpResponseClientError: true;
```

**Type**

true

[ClassDeclaration-11]: httpresponseclienterror.md#httpresponseclienterror
[Constructor-11]: httpresponseclienterror.md#constructorbody-options
[PropertyDeclaration-24]: httpresponseclienterror.md#ishttpresponseclienterror