# Table of contents

* [HttpResponseRedirection][ClassDeclaration-9]
    * Constructor
        * [constructor(body, options)][Constructor-9]
    * Properties
        * [isHttpResponseRedirection][PropertyDeclaration-20]

# HttpResponseRedirection

Represent an HTTP response with a redirection status 3xx.

```typescript
abstract class HttpResponseRedirection
```
## Constructor

### constructor(body, options)

Create an instance of HttpResponseRedirection.

```typescript
public constructor(body?: any, options: { stream?: boolean | undefined; } = {});
```

**Parameters**

| Name    | Type                                   | Default value | Description                      |
| ------- | -------------------------------------- | ------------- | -------------------------------- |
| body    | any                                    |               | - Optional body of the response. |
| options | { stream?: boolean &#124; undefined; } | {}            |                                  |

## Properties

### isHttpResponseRedirection

Property used internally by isHttpResponseRediction.

```typescript
public readonly isHttpResponseRedirection: true;
```

**Type**

true

[ClassDeclaration-9]: httpresponseredirection.md#httpresponseredirection
[Constructor-9]: httpresponseredirection.md#constructorbody-options
[PropertyDeclaration-20]: httpresponseredirection.md#ishttpresponseredirection