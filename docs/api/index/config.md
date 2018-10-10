# Table of contents

* [Config][ClassDeclaration-29]
    * Methods
        * [get(configName, propName, defaultValue)][MethodDeclaration-30]
    * Properties
        * [root][PropertyDeclaration-69]

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

[ClassDeclaration-29]: config.md#config
[MethodDeclaration-30]: config.md#getconfigname-propname-defaultvalue
[PropertyDeclaration-69]: config.md#root