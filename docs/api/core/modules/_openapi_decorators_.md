[@foal/core](../README.md) > ["openapi/decorators"](../modules/_openapi_decorators_.md)

# External module: "openapi/decorators"

## Index

### Functions

* [AddMetadataItem](_openapi_decorators_.md#addmetadataitem)
* [AddMetadataProperty](_openapi_decorators_.md#addmetadataproperty)
* [ApiCallback](_openapi_decorators_.md#apicallback)
* [ApiDefineCallback](_openapi_decorators_.md#apidefinecallback)
* [ApiDefineExample](_openapi_decorators_.md#apidefineexample)
* [ApiDefineHeader](_openapi_decorators_.md#apidefineheader)
* [ApiDefineLink](_openapi_decorators_.md#apidefinelink)
* [ApiDefineParameter](_openapi_decorators_.md#apidefineparameter)
* [ApiDefineRequestBody](_openapi_decorators_.md#apidefinerequestbody)
* [ApiDefineResponse](_openapi_decorators_.md#apidefineresponse)
* [ApiDefineSchema](_openapi_decorators_.md#apidefineschema)
* [ApiDefineSecurityScheme](_openapi_decorators_.md#apidefinesecurityscheme)
* [ApiDefineTag](_openapi_decorators_.md#apidefinetag)
* [ApiDeprecated](_openapi_decorators_.md#apideprecated)
* [ApiExternalDoc](_openapi_decorators_.md#apiexternaldoc)
* [ApiInfo](_openapi_decorators_.md#apiinfo)
* [ApiOperation](_openapi_decorators_.md#apioperation)
* [ApiParameter](_openapi_decorators_.md#apiparameter)
* [ApiRequestBody](_openapi_decorators_.md#apirequestbody)
* [ApiResponse](_openapi_decorators_.md#apiresponse)
* [ApiSecurityRequirement](_openapi_decorators_.md#apisecurityrequirement)
* [ApiServer](_openapi_decorators_.md#apiserver)
* [ApiUseTag](_openapi_decorators_.md#apiusetag)

---

## Functions

<a id="addmetadataitem"></a>

###  AddMetadataItem

▸ **AddMetadataItem**<`T`>(metadataKey: *`string`*, item: *`T`*): `(Anonymous function)`

*Defined in [openapi/decorators.ts:12](https://github.com/FoalTS/foal/blob/cf326d07/packages/core/src/openapi/decorators.ts#L12)*

**Type parameters:**

#### T 
**Parameters:**

| Name | Type |
| ------ | ------ |
| metadataKey | `string` |
| item | `T` |

**Returns:** `(Anonymous function)`

___
<a id="addmetadataproperty"></a>

###  AddMetadataProperty

▸ **AddMetadataProperty**(metadataKey: *`string`*, key: *`string`*, property: *`any`*): `(Anonymous function)`

*Defined in [openapi/decorators.ts:21](https://github.com/FoalTS/foal/blob/cf326d07/packages/core/src/openapi/decorators.ts#L21)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| metadataKey | `string` |
| key | `string` |
| property | `any` |

**Returns:** `(Anonymous function)`

___
<a id="apicallback"></a>

###  ApiCallback

▸ **ApiCallback**(key: *`string`*, callback: *[IApiCallback](../interfaces/_openapi_interfaces_.iapicallback.md) \| [IApiReference](../interfaces/_openapi_interfaces_.iapireference.md)*): `(Anonymous function)`

*Defined in [openapi/decorators.ts:73](https://github.com/FoalTS/foal/blob/cf326d07/packages/core/src/openapi/decorators.ts#L73)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| key | `string` |
| callback | [IApiCallback](../interfaces/_openapi_interfaces_.iapicallback.md) \| [IApiReference](../interfaces/_openapi_interfaces_.iapireference.md) |

**Returns:** `(Anonymous function)`

___
<a id="apidefinecallback"></a>

###  ApiDefineCallback

▸ **ApiDefineCallback**(key: *`string`*, callback: *[IApiCallback](../interfaces/_openapi_interfaces_.iapicallback.md) \| [IApiReference](../interfaces/_openapi_interfaces_.iapireference.md)*): `(Anonymous function)`

*Defined in [openapi/decorators.ts:113](https://github.com/FoalTS/foal/blob/cf326d07/packages/core/src/openapi/decorators.ts#L113)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| key | `string` |
| callback | [IApiCallback](../interfaces/_openapi_interfaces_.iapicallback.md) \| [IApiReference](../interfaces/_openapi_interfaces_.iapireference.md) |

**Returns:** `(Anonymous function)`

___
<a id="apidefineexample"></a>

###  ApiDefineExample

▸ **ApiDefineExample**(key: *`string`*, example: *[IApiExample](../interfaces/_openapi_interfaces_.iapiexample.md) \| [IApiReference](../interfaces/_openapi_interfaces_.iapireference.md)*): `(Anonymous function)`

*Defined in [openapi/decorators.ts:93](https://github.com/FoalTS/foal/blob/cf326d07/packages/core/src/openapi/decorators.ts#L93)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| key | `string` |
| example | [IApiExample](../interfaces/_openapi_interfaces_.iapiexample.md) \| [IApiReference](../interfaces/_openapi_interfaces_.iapireference.md) |

**Returns:** `(Anonymous function)`

___
<a id="apidefineheader"></a>

###  ApiDefineHeader

▸ **ApiDefineHeader**(key: *`string`*, header: *[IApiHeader](_openapi_interfaces_.md#iapiheader) \| [IApiReference](../interfaces/_openapi_interfaces_.iapireference.md)*): `(Anonymous function)`

*Defined in [openapi/decorators.ts:101](https://github.com/FoalTS/foal/blob/cf326d07/packages/core/src/openapi/decorators.ts#L101)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| key | `string` |
| header | [IApiHeader](_openapi_interfaces_.md#iapiheader) \| [IApiReference](../interfaces/_openapi_interfaces_.iapireference.md) |

**Returns:** `(Anonymous function)`

___
<a id="apidefinelink"></a>

###  ApiDefineLink

▸ **ApiDefineLink**(key: *`string`*, link: *[IApiLink](../interfaces/_openapi_interfaces_.iapilink.md) \| [IApiReference](../interfaces/_openapi_interfaces_.iapireference.md)*): `(Anonymous function)`

*Defined in [openapi/decorators.ts:109](https://github.com/FoalTS/foal/blob/cf326d07/packages/core/src/openapi/decorators.ts#L109)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| key | `string` |
| link | [IApiLink](../interfaces/_openapi_interfaces_.iapilink.md) \| [IApiReference](../interfaces/_openapi_interfaces_.iapireference.md) |

**Returns:** `(Anonymous function)`

___
<a id="apidefineparameter"></a>

###  ApiDefineParameter

▸ **ApiDefineParameter**(key: *`string`*, parameter: *[IApiParameter](_openapi_interfaces_.md#iapiparameter) \| [IApiReference](../interfaces/_openapi_interfaces_.iapireference.md)*): `(Anonymous function)`

*Defined in [openapi/decorators.ts:89](https://github.com/FoalTS/foal/blob/cf326d07/packages/core/src/openapi/decorators.ts#L89)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| key | `string` |
| parameter | [IApiParameter](_openapi_interfaces_.md#iapiparameter) \| [IApiReference](../interfaces/_openapi_interfaces_.iapireference.md) |

**Returns:** `(Anonymous function)`

___
<a id="apidefinerequestbody"></a>

###  ApiDefineRequestBody

▸ **ApiDefineRequestBody**(key: *`string`*, requestBody: *[IApiRequestBody](../interfaces/_openapi_interfaces_.iapirequestbody.md) \| [IApiReference](../interfaces/_openapi_interfaces_.iapireference.md)*): `(Anonymous function)`

*Defined in [openapi/decorators.ts:97](https://github.com/FoalTS/foal/blob/cf326d07/packages/core/src/openapi/decorators.ts#L97)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| key | `string` |
| requestBody | [IApiRequestBody](../interfaces/_openapi_interfaces_.iapirequestbody.md) \| [IApiReference](../interfaces/_openapi_interfaces_.iapireference.md) |

**Returns:** `(Anonymous function)`

___
<a id="apidefineresponse"></a>

###  ApiDefineResponse

▸ **ApiDefineResponse**(key: *`string`*, response: *[IApiResponse](../interfaces/_openapi_interfaces_.iapiresponse.md) \| [IApiReference](../interfaces/_openapi_interfaces_.iapireference.md)*): `(Anonymous function)`

*Defined in [openapi/decorators.ts:85](https://github.com/FoalTS/foal/blob/cf326d07/packages/core/src/openapi/decorators.ts#L85)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| key | `string` |
| response | [IApiResponse](../interfaces/_openapi_interfaces_.iapiresponse.md) \| [IApiReference](../interfaces/_openapi_interfaces_.iapireference.md) |

**Returns:** `(Anonymous function)`

___
<a id="apidefineschema"></a>

###  ApiDefineSchema

▸ **ApiDefineSchema**(key: *`string`*, schema: *[IApiSchema](../interfaces/_openapi_interfaces_.iapischema.md) \| [IApiReference](../interfaces/_openapi_interfaces_.iapireference.md)*): `(Anonymous function)`

*Defined in [openapi/decorators.ts:81](https://github.com/FoalTS/foal/blob/cf326d07/packages/core/src/openapi/decorators.ts#L81)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| key | `string` |
| schema | [IApiSchema](../interfaces/_openapi_interfaces_.iapischema.md) \| [IApiReference](../interfaces/_openapi_interfaces_.iapireference.md) |

**Returns:** `(Anonymous function)`

___
<a id="apidefinesecurityscheme"></a>

###  ApiDefineSecurityScheme

▸ **ApiDefineSecurityScheme**(key: *`string`*, securityScheme: *[IApiSecurityScheme](_openapi_interfaces_.md#iapisecurityscheme) \| [IApiReference](../interfaces/_openapi_interfaces_.iapireference.md)*): `(Anonymous function)`

*Defined in [openapi/decorators.ts:105](https://github.com/FoalTS/foal/blob/cf326d07/packages/core/src/openapi/decorators.ts#L105)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| key | `string` |
| securityScheme | [IApiSecurityScheme](_openapi_interfaces_.md#iapisecurityscheme) \| [IApiReference](../interfaces/_openapi_interfaces_.iapireference.md) |

**Returns:** `(Anonymous function)`

___
<a id="apidefinetag"></a>

###  ApiDefineTag

▸ **ApiDefineTag**(tag: *[IApiTag](../interfaces/_openapi_interfaces_.iapitag.md)*): `(Anonymous function)`

*Defined in [openapi/decorators.ts:42](https://github.com/FoalTS/foal/blob/cf326d07/packages/core/src/openapi/decorators.ts#L42)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| tag | [IApiTag](../interfaces/_openapi_interfaces_.iapitag.md) |

**Returns:** `(Anonymous function)`

___
<a id="apideprecated"></a>

###  ApiDeprecated

▸ **ApiDeprecated**(deprecated?: *`boolean`*): `function`

*Defined in [openapi/decorators.ts:77](https://github.com/FoalTS/foal/blob/cf326d07/packages/core/src/openapi/decorators.ts#L77)*

**Parameters:**

| Name | Type | Default value |
| ------ | ------ | ------ |
| `Default value` deprecated | `boolean` | true |

**Returns:** `function`

___
<a id="apiexternaldoc"></a>

###  ApiExternalDoc

▸ **ApiExternalDoc**(externalDoc: *[IApiExternalDocumentation](../interfaces/_openapi_interfaces_.iapiexternaldocumentation.md)*): `function`

*Defined in [openapi/decorators.ts:46](https://github.com/FoalTS/foal/blob/cf326d07/packages/core/src/openapi/decorators.ts#L46)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| externalDoc | [IApiExternalDocumentation](../interfaces/_openapi_interfaces_.iapiexternaldocumentation.md) |

**Returns:** `function`

___
<a id="apiinfo"></a>

###  ApiInfo

▸ **ApiInfo**(info: *[IApiInfo](../interfaces/_openapi_interfaces_.iapiinfo.md)*): `function`

*Defined in [openapi/decorators.ts:30](https://github.com/FoalTS/foal/blob/cf326d07/packages/core/src/openapi/decorators.ts#L30)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| info | [IApiInfo](../interfaces/_openapi_interfaces_.iapiinfo.md) |

**Returns:** `function`

___
<a id="apioperation"></a>

###  ApiOperation

▸ **ApiOperation**(operation: *[IApiOperation](../interfaces/_openapi_interfaces_.iapioperation.md)*): `function`

*Defined in [openapi/decorators.ts:50](https://github.com/FoalTS/foal/blob/cf326d07/packages/core/src/openapi/decorators.ts#L50)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| operation | [IApiOperation](../interfaces/_openapi_interfaces_.iapioperation.md) |

**Returns:** `function`

___
<a id="apiparameter"></a>

###  ApiParameter

▸ **ApiParameter**(parameter: *[IApiParameter](_openapi_interfaces_.md#iapiparameter) \| [IApiReference](../interfaces/_openapi_interfaces_.iapireference.md)*): `(Anonymous function)`

*Defined in [openapi/decorators.ts:58](https://github.com/FoalTS/foal/blob/cf326d07/packages/core/src/openapi/decorators.ts#L58)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| parameter | [IApiParameter](_openapi_interfaces_.md#iapiparameter) \| [IApiReference](../interfaces/_openapi_interfaces_.iapireference.md) |

**Returns:** `(Anonymous function)`

___
<a id="apirequestbody"></a>

###  ApiRequestBody

▸ **ApiRequestBody**(requestBody: *[IApiRequestBody](../interfaces/_openapi_interfaces_.iapirequestbody.md) \| [IApiReference](../interfaces/_openapi_interfaces_.iapireference.md)*): `function`

*Defined in [openapi/decorators.ts:62](https://github.com/FoalTS/foal/blob/cf326d07/packages/core/src/openapi/decorators.ts#L62)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| requestBody | [IApiRequestBody](../interfaces/_openapi_interfaces_.iapirequestbody.md) \| [IApiReference](../interfaces/_openapi_interfaces_.iapireference.md) |

**Returns:** `function`

___
<a id="apiresponse"></a>

###  ApiResponse

▸ **ApiResponse**(key: *"default" \| "1XX" \| "2XX" \| "3XX" \| "4XX" \| "5XX" \| `number`*, response: *[IApiResponse](../interfaces/_openapi_interfaces_.iapiresponse.md) \| [IApiReference](../interfaces/_openapi_interfaces_.iapireference.md)*): `(Anonymous function)`

*Defined in [openapi/decorators.ts:66](https://github.com/FoalTS/foal/blob/cf326d07/packages/core/src/openapi/decorators.ts#L66)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| key | "default" \| "1XX" \| "2XX" \| "3XX" \| "4XX" \| "5XX" \| `number` |
| response | [IApiResponse](../interfaces/_openapi_interfaces_.iapiresponse.md) \| [IApiReference](../interfaces/_openapi_interfaces_.iapireference.md) |

**Returns:** `(Anonymous function)`

___
<a id="apisecurityrequirement"></a>

###  ApiSecurityRequirement

▸ **ApiSecurityRequirement**(securityRequirement: *[IApiSecurityRequirement](../interfaces/_openapi_interfaces_.iapisecurityrequirement.md)*): `(Anonymous function)`

*Defined in [openapi/decorators.ts:38](https://github.com/FoalTS/foal/blob/cf326d07/packages/core/src/openapi/decorators.ts#L38)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| securityRequirement | [IApiSecurityRequirement](../interfaces/_openapi_interfaces_.iapisecurityrequirement.md) |

**Returns:** `(Anonymous function)`

___
<a id="apiserver"></a>

###  ApiServer

▸ **ApiServer**(server: *[IApiServer](../interfaces/_openapi_interfaces_.iapiserver.md)*): `(Anonymous function)`

*Defined in [openapi/decorators.ts:34](https://github.com/FoalTS/foal/blob/cf326d07/packages/core/src/openapi/decorators.ts#L34)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| server | [IApiServer](../interfaces/_openapi_interfaces_.iapiserver.md) |

**Returns:** `(Anonymous function)`

___
<a id="apiusetag"></a>

###  ApiUseTag

▸ **ApiUseTag**(tag: *`string`*): `(Anonymous function)`

*Defined in [openapi/decorators.ts:54](https://github.com/FoalTS/foal/blob/cf326d07/packages/core/src/openapi/decorators.ts#L54)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| tag | `string` |

**Returns:** `(Anonymous function)`

___

