# Table of contents

* [Config][ClassDeclaration-24]
    * Methods
        * [get(configName, propName, defaultValue)][MethodDeclaration-21]
    * Properties
        * [root][PropertyDeclaration-53]

# Config

```typescript
class Config
```
## Methods

### get(configName, propName, defaultValue)

```typescript
public static get(configName: string, propName: string, defaultValue?: number | string | boolean): number | string | boolean | undefined;
```

**Parameters**

| Name         | Type                                |
| ------------ | ----------------------------------- |
| configName   | string                              |
| propName     | string                              |
| defaultValue | number &#124; string &#124; boolean |

**Return type**

number | string | boolean | undefined

## Properties

### root

```typescript
public static root: string;
```

**Type**

string

[ClassDeclaration-24]: config.md#config
[MethodDeclaration-21]: config.md#getconfigname-propname-defaultvalue
[PropertyDeclaration-53]: config.md#root