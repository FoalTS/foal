# Table of contents

* [HttpResponseSuccess][ClassDeclaration-5]
    * Constructor
        * [constructor(body, options)][Constructor-5]
    * Properties
        * [isHttpResponseSuccess][PropertyDeclaration-9]

# HttpResponseSuccess

Represent an HTTP response with a success status 2xx.

```typescript
abstract class HttpResponseSuccess
```
## Constructor

### constructor(body, options)

Create an instance of HttpResponseSuccess.

```typescript
public constructor(body?: any, options: { stream?: boolean | undefined; } = {});
```

**Parameters**

| Name    | Type                                   | Default value | Description                      |
| ------- | -------------------------------------- | ------------- | -------------------------------- |
| body    | any                                    |               | - Optional body of the response. |
| options | { stream?: boolean &#124; undefined; } | {}            |                                  |

## Properties

### isHttpResponseSuccess

Property used internally by isHttpResponseSuccess.

```typescript
public readonly isHttpResponseSuccess: true;
```

**Type**

true

[ClassDeclaration-5]: httpresponsesuccess.md#httpresponsesuccess
[Constructor-5]: httpresponsesuccess.md#constructorbody-options
[PropertyDeclaration-9]: httpresponsesuccess.md#ishttpresponsesuccess