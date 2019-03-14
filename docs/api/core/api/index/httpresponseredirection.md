# Table of contents

* [HttpResponseRedirection][ClassDeclaration-9]
    * Constructor
        * [constructor(body)][Constructor-9]
    * Properties
        * [isHttpResponseRedirection][PropertyDeclaration-19]

# HttpResponseRedirection

Represent an HTTP response with a redirection status 3xx.

```typescript
abstract class HttpResponseRedirection
```
## Constructor

### constructor(body)

Create an instance of HttpResponseRedirection.

```typescript
public constructor(body?: any);
```

**Parameters**

| Name | Type | Description                      |
| ---- | ---- | -------------------------------- |
| body | any  | - Optional body of the response. |

## Properties

### isHttpResponseRedirection

Property used internally by isHttpResponseRediction.

```typescript
public readonly isHttpResponseRedirection: true;
```

**Type**

true

[ClassDeclaration-9]: httpresponseredirection.md#httpresponseredirection
[Constructor-9]: httpresponseredirection.md#constructorbody
[PropertyDeclaration-19]: httpresponseredirection.md#ishttpresponseredirection