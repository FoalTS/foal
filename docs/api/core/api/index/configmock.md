# Table of contents

* [ConfigMock][ClassDeclaration-23]
    * Methods
        * [set(key, value)][MethodDeclaration-8]
        * [get(key, defaultValue)][MethodDeclaration-9]
        * [reset()][MethodDeclaration-10]

# ConfigMock

Mock the Config class when it is used as a service.

```typescript
class ConfigMock implements Config
```
## Methods

### set(key, value)

Set an configuration variable.

```typescript
public set(key: string, value: any): void;
```

**Parameters**

| Name  | Type   | Description                                         |
| ----- | ------ | --------------------------------------------------- |
| key   | string | - Name of the config key using dots and camel case. |
| value | any    | - The config value (ex: 36000).                     |

**Return type**

void

----------

### get(key, defaultValue)

Return the config value previously given with ConfigMock.set.

```typescript
public get<T = any>(key: string, defaultValue?: T | undefined): T;
```

**Type parameters**

| Name | Default |
| ---- | ------- |
| T    | any     |

**Parameters**

| Name         | Type               | Description                                                           |
| ------------ | ------------------ | --------------------------------------------------------------------- |
| key          | string             | - Name of the config key using dots and camel case.                   |
| defaultValue | T &#124; undefined | - Default value to return if no configuration is found with that key. |

**Return type**

T

----------

### reset()

Clear every config value previously given with Config.set.

```typescript
public reset(): void;
```

**Return type**

void

[ClassDeclaration-23]: configmock.md#configmock
[MethodDeclaration-8]: configmock.md#setkey-value
[MethodDeclaration-9]: configmock.md#getkey-defaultvalue
[MethodDeclaration-10]: configmock.md#reset