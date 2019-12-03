[@foal/core](../README.md) > ["core/config"](../modules/_core_config_.md) > [Config](../classes/_core_config_.config.md)

# Class: Config

Static class to access environment variables and configuration files.

This class can also be used as a service.

*__export__*: 

*__class__*: Config

## Hierarchy

**Config**

## Implemented by

* [ConfigMock](_core_config_mock_.configmock.md)

## Index

### Properties

* [yaml](_core_config_.config.md#yaml)

### Methods

* [get](_core_config_.config.md#get)
* [clearCache](_core_config_.config.md#clearcache)
* [convertType](_core_config_.config.md#converttype)
* [dotToUnderscore](_core_config_.config.md#dottounderscore)
* [get](_core_config_.config.md#get-1)
* [getValue](_core_config_.config.md#getvalue)
* [getYAMLInstance](_core_config_.config.md#getyamlinstance)
* [readDotEnvValue](_core_config_.config.md#readdotenvvalue)
* [readJSONValue](_core_config_.config.md#readjsonvalue)
* [readYAMLValue](_core_config_.config.md#readyamlvalue)

### Object literals

* [cache](_core_config_.config.md#cache)

---

## Properties

<a id="yaml"></a>

### `<Static>``<Private>` yaml

**● yaml**: *`any`*

*Defined in [core/config.ts:91](https://github.com/FoalTS/foal/blob/70cc46bd/packages/core/src/core/config.ts#L91)*

___

## Methods

<a id="get"></a>

###  get

▸ **get**<`T`>(key: *`string`*, defaultValue?: *[T]()*): `T`

*Defined in [core/config.ts:225](https://github.com/FoalTS/foal/blob/70cc46bd/packages/core/src/core/config.ts#L225)*

Access environment variables and configuration files.

For example, if it is called with the string `settings.session.secret`, the method will go through these steps:

1.  If the environment variable `SETTINGS_SESSION_SECRET` exists, then return its value.
2.  If `.env` exists and has a line `SETTINGS_SESSION_SECRET=`, then return its value.
3.  If `config/${NODE_ENV}.json` exists and the property `config['settings']['session']['secret']` does too, then return its value.
4.  Same with `config/${NODE_ENV}.yml`.
5.  If `config/default.json` exists and the property `config['settings']['session']['secret']` does too, then return its value.
6.  Same with `config/default.yml`.

If none value is found, then the method returns the default value provided as second argument to the function. If none was given, it returns undefined.

*__template__*: T - TypeScript type of the returned value. Default is `any`.

*__memberof__*: Config

**Type parameters:**

#### T 
**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| key | `string` |  Name of the config key using dots and camel case. |
| `Optional` defaultValue | [T]() |

**Returns:** `T`
The configuration value.

___
<a id="clearcache"></a>

### `<Static>` clearCache

▸ **clearCache**(): `void`

*Defined in [core/config.ts:83](https://github.com/FoalTS/foal/blob/70cc46bd/packages/core/src/core/config.ts#L83)*

Clear the cache of the loaded files.

*__static__*: 

*__memberof__*: Config

**Returns:** `void`

___
<a id="converttype"></a>

### `<Static>``<Private>` convertType

▸ **convertType**(value: *`string`*): `boolean` \| `number` \| `string`

*Defined in [core/config.ts:172](https://github.com/FoalTS/foal/blob/70cc46bd/packages/core/src/core/config.ts#L172)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| value | `string` |

**Returns:** `boolean` \| `number` \| `string`

___
<a id="dottounderscore"></a>

### `<Static>``<Private>` dotToUnderscore

▸ **dotToUnderscore**(str: *`string`*): `string`

*Defined in [core/config.ts:165](https://github.com/FoalTS/foal/blob/70cc46bd/packages/core/src/core/config.ts#L165)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| str | `string` |

**Returns:** `string`

___
<a id="get-1"></a>

### `<Static>` get

▸ **get**<`T`>(key: *`string`*, defaultValue?: *[T]()*): `T`

*Defined in [core/config.ts:39](https://github.com/FoalTS/foal/blob/70cc46bd/packages/core/src/core/config.ts#L39)*

Access environment variables and configuration files.

For example, if it is called with the string `settings.session.secret`, the method will go through these steps:

1.  If the environment variable `SETTINGS_SESSION_SECRET` exists, then return its value.
2.  If `.env` exists and has a line `SETTINGS_SESSION_SECRET=`, then return its value.
3.  If `config/${NODE_ENV}.json` exists and the property `config['settings']['session']['secret']` does too, then return its value.
4.  Same with `config/${NODE_ENV}.yml`.
5.  If `config/default.json` exists and the property `config['settings']['session']['secret']` does too, then return its value.
6.  Same with `config/default.yml`.

If none value is found, then the method returns the default value provided as second argument to the function. If none was given, it returns undefined.

*__static__*: 

*__template__*: T - TypeScript type of the returned value. Default is `any`.

*__memberof__*: Config

**Type parameters:**

#### T 
**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| key | `string` |  Name of the config key using dots and camel case. |
| `Optional` defaultValue | [T]() |

**Returns:** `T`
The configuration value.

___
<a id="getvalue"></a>

### `<Static>``<Private>` getValue

▸ **getValue**(config: *`object`*, propertyPath: *`string`*): `any`

*Defined in [core/config.ts:189](https://github.com/FoalTS/foal/blob/70cc46bd/packages/core/src/core/config.ts#L189)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| config | `object` |
| propertyPath | `string` |

**Returns:** `any`

___
<a id="getyamlinstance"></a>

### `<Static>``<Private>` getYAMLInstance

▸ **getYAMLInstance**(): `false` \| `any`

*Defined in [core/config.ts:150](https://github.com/FoalTS/foal/blob/70cc46bd/packages/core/src/core/config.ts#L150)*

**Returns:** `false` \| `any`

___
<a id="readdotenvvalue"></a>

### `<Static>``<Private>` readDotEnvValue

▸ **readDotEnvValue**(name: *`string`*): `string` \| `boolean` \| `number` \| `undefined`

*Defined in [core/config.ts:98](https://github.com/FoalTS/foal/blob/70cc46bd/packages/core/src/core/config.ts#L98)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| name | `string` |

**Returns:** `string` \| `boolean` \| `number` \| `undefined`

___
<a id="readjsonvalue"></a>

### `<Static>``<Private>` readJSONValue

▸ **readJSONValue**(path: *`string`*, key: *`string`*): `any`

*Defined in [core/config.ts:118](https://github.com/FoalTS/foal/blob/70cc46bd/packages/core/src/core/config.ts#L118)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| path | `string` |
| key | `string` |

**Returns:** `any`

___
<a id="readyamlvalue"></a>

### `<Static>``<Private>` readYAMLValue

▸ **readYAMLValue**(path: *`string`*, key: *`string`*): `any`

*Defined in [core/config.ts:131](https://github.com/FoalTS/foal/blob/70cc46bd/packages/core/src/core/config.ts#L131)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| path | `string` |
| key | `string` |

**Returns:** `any`

___

## Object literals

<a id="cache"></a>

### `<Static>``<Private>` cache

**cache**: *`object`*

*Defined in [core/config.ts:92](https://github.com/FoalTS/foal/blob/70cc46bd/packages/core/src/core/config.ts#L92)*

<a id="cache.dotenv"></a>

####  dotEnv

**● dotEnv**: *`undefined`* =  undefined

*Defined in [core/config.ts:93](https://github.com/FoalTS/foal/blob/70cc46bd/packages/core/src/core/config.ts#L93)*

___
<a id="cache.json"></a>

####  json

**● json**: *`object`*

*Defined in [core/config.ts:94](https://github.com/FoalTS/foal/blob/70cc46bd/packages/core/src/core/config.ts#L94)*

#### Type declaration

___
<a id="cache.yaml-1"></a>

####  yaml

**● yaml**: *`object`*

*Defined in [core/config.ts:95](https://github.com/FoalTS/foal/blob/70cc46bd/packages/core/src/core/config.ts#L95)*

#### Type declaration

___

___

