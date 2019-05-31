[@foal/core](../README.md) > ["core/config-mock"](../modules/_core_config_mock_.md) > [ConfigMock](../classes/_core_config_mock_.configmock.md)

# Class: ConfigMock

Mock the Config class when it is used as a service.

*__export__*: 

*__class__*: ConfigMock

*__implements__*: {Config}

## Hierarchy

**ConfigMock**

## Implements

* [Config](_core_config_.config.md)

## Index

### Properties

* [map](_core_config_mock_.configmock.md#map)

### Methods

* [get](_core_config_mock_.configmock.md#get)
* [reset](_core_config_mock_.configmock.md#reset)
* [set](_core_config_mock_.configmock.md#set)

---

## Properties

<a id="map"></a>

### `<Private>` map

**● map**: *`Map`<`string`, `any`>* =  new Map()

*Defined in [core/config-mock.ts:12](https://github.com/FoalTS/foal/blob/cf326d07/packages/core/src/core/config-mock.ts#L12)*

___

## Methods

<a id="get"></a>

###  get

▸ **get**<`T`>(key: *`string`*, defaultValue?: *`T` \| `undefined`*): `T`

*Defined in [core/config-mock.ts:34](https://github.com/FoalTS/foal/blob/cf326d07/packages/core/src/core/config-mock.ts#L34)*

Return the config value previously given with ConfigMock.set.

*__template__*: T - TypeScript type of the returned value. Default is `any`.

*__memberof__*: ConfigMock

**Type parameters:**

#### T 
**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| key | `string` |  Name of the config key using dots and camel case. |
| `Optional` defaultValue | `T` \| `undefined` |

**Returns:** `T`
The configuration value.

___
<a id="reset"></a>

###  reset

▸ **reset**(): `void`

*Defined in [core/config-mock.ts:43](https://github.com/FoalTS/foal/blob/cf326d07/packages/core/src/core/config-mock.ts#L43)*

Clear every config value previously given with Config.set.

*__memberof__*: ConfigMock

**Returns:** `void`

___
<a id="set"></a>

###  set

▸ **set**(key: *`string`*, value: *`any`*): `void`

*Defined in [core/config-mock.ts:21](https://github.com/FoalTS/foal/blob/cf326d07/packages/core/src/core/config-mock.ts#L21)*

Set an configuration variable.

*__memberof__*: ConfigMock

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| key | `string` |  Name of the config key using dots and camel case. |
| value | `any` |  The config value (ex: 36000). |

**Returns:** `void`

___

