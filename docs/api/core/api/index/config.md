# Table of contents

* [Config][ClassDeclaration-22]
    * Methods
        * [get(key, defaultValue)][MethodDeclaration-8]
        * [get(key, defaultValue)][MethodDeclaration-10]
        * [clearCache()][MethodDeclaration-9]

# Config

```typescript
class Config
```
## Methods

### get(key, defaultValue)

```typescript
public static get<T = any>(key: string, defaultValue?: T | undefined): T;
```

**Type parameters**

| Name | Default |
| ---- | ------- |
| T    | any     |

**Parameters**

| Name         | Type               |
| ------------ | ------------------ |
| key          | string             |
| defaultValue | T &#124; undefined |

**Return type**

T

----------

### get(key, defaultValue)

```typescript
public get<T = any>(key: string, defaultValue?: T | undefined): T;
```

**Type parameters**

| Name | Default |
| ---- | ------- |
| T    | any     |

**Parameters**

| Name         | Type               |
| ------------ | ------------------ |
| key          | string             |
| defaultValue | T &#124; undefined |

**Return type**

T

----------

### clearCache()

```typescript
public static clearCache(): void;
```

**Return type**

void

[ClassDeclaration-22]: config.md#config
[MethodDeclaration-8]: config.md#getkey-defaultvalue
[MethodDeclaration-10]: config.md#getkey-defaultvalue
[MethodDeclaration-9]: config.md#clearcache