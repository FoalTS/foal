[@foal/core](../README.md) > ["core/routes/utils"](../modules/_core_routes_utils_.md)

# External module: "core/routes/utils"

## Index

### Functions

* [getHttpMethod](_core_routes_utils_.md#gethttpmethod)
* [getMetadata](_core_routes_utils_.md#getmetadata)
* [getPath](_core_routes_utils_.md#getpath)
* [join](_core_routes_utils_.md#join)

---

## Functions

<a id="gethttpmethod"></a>

###  getHttpMethod

▸ **getHttpMethod**(target: *[Class](_core_class_interface_.md#class)*, propertyKey?: *`undefined` \| `string`*): `string` \| `undefined`

*Defined in [core/routes/utils.ts:31](https://github.com/FoalTS/foal/blob/70cc46bd/packages/core/src/core/routes/utils.ts#L31)*

Get the HTTP method of a controller method.

*__export__*: 

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| target | [Class](_core_class_interface_.md#class) |  The controller class. |
| `Optional` propertyKey | `undefined` \| `string` |

**Returns:** `string` \| `undefined`
*   The HTTP method or undefined if none was defined.

___
<a id="getmetadata"></a>

###  getMetadata

▸ **getMetadata**(metadataKey: *`string`*, target: *[Class](_core_class_interface_.md#class)*, propertyKey?: *`undefined` \| `string`*): `any`

*Defined in [core/routes/utils.ts:16](https://github.com/FoalTS/foal/blob/70cc46bd/packages/core/src/core/routes/utils.ts#L16)*

Get metadata of a class or a class method.

*__export__*: 

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| metadataKey | `string` |  The name of the metadata. |
| target | [Class](_core_class_interface_.md#class) |  The class. |
| `Optional` propertyKey | `undefined` \| `string` |

**Returns:** `any`
The metadata value.

___
<a id="getpath"></a>

###  getPath

▸ **getPath**(target: *[Class](_core_class_interface_.md#class)*, propertyKey?: *`undefined` \| `string`*): `string` \| `undefined`

*Defined in [core/routes/utils.ts:43](https://github.com/FoalTS/foal/blob/70cc46bd/packages/core/src/core/routes/utils.ts#L43)*

Get the path of a controller method.

*__export__*: 

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| target | [Class](_core_class_interface_.md#class) |  The controller class. |
| `Optional` propertyKey | `undefined` \| `string` |

**Returns:** `string` \| `undefined`
*   The path or undefined if none was defined.

___
<a id="join"></a>

###  join

▸ **join**(...paths: *(`undefined` \| `string`)[]*): `string`

*Defined in [core/routes/utils.ts:54](https://github.com/FoalTS/foal/blob/70cc46bd/packages/core/src/core/routes/utils.ts#L54)*

Join several HTTP request paths together.

*__export__*: 

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| `Rest` paths | (`undefined` \| `string`)[] |  The paths. |

**Returns:** `string`
The resulted path.

___

