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
* [ApiOperationDescription](_openapi_decorators_.md#apioperationdescription)
* [ApiOperationId](_openapi_decorators_.md#apioperationid)
* [ApiOperationSummary](_openapi_decorators_.md#apioperationsummary)
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

*Defined in [openapi/decorators.ts:12](https://github.com/FoalTS/foal/blob/70cc46bd/packages/core/src/openapi/decorators.ts#L12)*

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

*Defined in [openapi/decorators.ts:21](https://github.com/FoalTS/foal/blob/70cc46bd/packages/core/src/openapi/decorators.ts#L21)*

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

▸ **ApiCallback**(key: *`string`*, callback: *[IApiCallback](../interfaces/_openapi_interfaces_.iapicallback.md) \| [IApiReference](../interfaces/_openapi_interfaces_.iapireference.md) \| `function`*): `(Anonymous function)`

*Defined in [openapi/decorators.ts:94](https://github.com/FoalTS/foal/blob/70cc46bd/packages/core/src/openapi/decorators.ts#L94)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| key | `string` |
| callback | [IApiCallback](../interfaces/_openapi_interfaces_.iapicallback.md) \| [IApiReference](../interfaces/_openapi_interfaces_.iapireference.md) \| `function` |

**Returns:** `(Anonymous function)`

___
<a id="apidefinecallback"></a>

###  ApiDefineCallback

▸ **ApiDefineCallback**(key: *`string`*, callback: *[IApiCallback](../interfaces/_openapi_interfaces_.iapicallback.md) \| [IApiReference](../interfaces/_openapi_interfaces_.iapireference.md) \| `function`*): `(Anonymous function)`

*Defined in [openapi/decorators.ts:153](https://github.com/FoalTS/foal/blob/70cc46bd/packages/core/src/openapi/decorators.ts#L153)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| key | `string` |
| callback | [IApiCallback](../interfaces/_openapi_interfaces_.iapicallback.md) \| [IApiReference](../interfaces/_openapi_interfaces_.iapireference.md) \| `function` |

**Returns:** `(Anonymous function)`

___
<a id="apidefineexample"></a>

###  ApiDefineExample

▸ **ApiDefineExample**(key: *`string`*, example: *[IApiExample](../interfaces/_openapi_interfaces_.iapiexample.md) \| [IApiReference](../interfaces/_openapi_interfaces_.iapireference.md) \| `function`*): `(Anonymous function)`

*Defined in [openapi/decorators.ts:122](https://github.com/FoalTS/foal/blob/70cc46bd/packages/core/src/openapi/decorators.ts#L122)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| key | `string` |
| example | [IApiExample](../interfaces/_openapi_interfaces_.iapiexample.md) \| [IApiReference](../interfaces/_openapi_interfaces_.iapireference.md) \| `function` |

**Returns:** `(Anonymous function)`

___
<a id="apidefineheader"></a>

###  ApiDefineHeader

▸ **ApiDefineHeader**(key: *`string`*, header: *[IApiHeader](_openapi_interfaces_.md#iapiheader) \| [IApiReference](../interfaces/_openapi_interfaces_.iapireference.md) \| `function`*): `(Anonymous function)`

*Defined in [openapi/decorators.ts:134](https://github.com/FoalTS/foal/blob/70cc46bd/packages/core/src/openapi/decorators.ts#L134)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| key | `string` |
| header | [IApiHeader](_openapi_interfaces_.md#iapiheader) \| [IApiReference](../interfaces/_openapi_interfaces_.iapireference.md) \| `function` |

**Returns:** `(Anonymous function)`

___
<a id="apidefinelink"></a>

###  ApiDefineLink

▸ **ApiDefineLink**(key: *`string`*, link: *[IApiLink](../interfaces/_openapi_interfaces_.iapilink.md) \| [IApiReference](../interfaces/_openapi_interfaces_.iapireference.md) \| `function`*): `(Anonymous function)`

*Defined in [openapi/decorators.ts:147](https://github.com/FoalTS/foal/blob/70cc46bd/packages/core/src/openapi/decorators.ts#L147)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| key | `string` |
| link | [IApiLink](../interfaces/_openapi_interfaces_.iapilink.md) \| [IApiReference](../interfaces/_openapi_interfaces_.iapireference.md) \| `function` |

**Returns:** `(Anonymous function)`

___
<a id="apidefineparameter"></a>

###  ApiDefineParameter

▸ **ApiDefineParameter**(key: *`string`*, parameter: *[IApiParameter](_openapi_interfaces_.md#iapiparameter) \| [IApiReference](../interfaces/_openapi_interfaces_.iapireference.md) \| `function`*): `(Anonymous function)`

*Defined in [openapi/decorators.ts:116](https://github.com/FoalTS/foal/blob/70cc46bd/packages/core/src/openapi/decorators.ts#L116)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| key | `string` |
| parameter | [IApiParameter](_openapi_interfaces_.md#iapiparameter) \| [IApiReference](../interfaces/_openapi_interfaces_.iapireference.md) \| `function` |

**Returns:** `(Anonymous function)`

___
<a id="apidefinerequestbody"></a>

###  ApiDefineRequestBody

▸ **ApiDefineRequestBody**(key: *`string`*, requestBody: *[IApiRequestBody](../interfaces/_openapi_interfaces_.iapirequestbody.md) \| [IApiReference](../interfaces/_openapi_interfaces_.iapireference.md) \| `function`*): `(Anonymous function)`

*Defined in [openapi/decorators.ts:128](https://github.com/FoalTS/foal/blob/70cc46bd/packages/core/src/openapi/decorators.ts#L128)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| key | `string` |
| requestBody | [IApiRequestBody](../interfaces/_openapi_interfaces_.iapirequestbody.md) \| [IApiReference](../interfaces/_openapi_interfaces_.iapireference.md) \| `function` |

**Returns:** `(Anonymous function)`

___
<a id="apidefineresponse"></a>

###  ApiDefineResponse

▸ **ApiDefineResponse**(key: *`string`*, response: *[IApiResponse](../interfaces/_openapi_interfaces_.iapiresponse.md) \| [IApiReference](../interfaces/_openapi_interfaces_.iapireference.md) \| `function`*): `(Anonymous function)`

*Defined in [openapi/decorators.ts:110](https://github.com/FoalTS/foal/blob/70cc46bd/packages/core/src/openapi/decorators.ts#L110)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| key | `string` |
| response | [IApiResponse](../interfaces/_openapi_interfaces_.iapiresponse.md) \| [IApiReference](../interfaces/_openapi_interfaces_.iapireference.md) \| `function` |

**Returns:** `(Anonymous function)`

___
<a id="apidefineschema"></a>

###  ApiDefineSchema

▸ **ApiDefineSchema**(key: *`string`*, schema: *[IApiSchema](../interfaces/_openapi_interfaces_.iapischema.md) \| [IApiReference](../interfaces/_openapi_interfaces_.iapireference.md) \| `function`*): `(Anonymous function)`

*Defined in [openapi/decorators.ts:104](https://github.com/FoalTS/foal/blob/70cc46bd/packages/core/src/openapi/decorators.ts#L104)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| key | `string` |
| schema | [IApiSchema](../interfaces/_openapi_interfaces_.iapischema.md) \| [IApiReference](../interfaces/_openapi_interfaces_.iapireference.md) \| `function` |

**Returns:** `(Anonymous function)`

___
<a id="apidefinesecurityscheme"></a>

###  ApiDefineSecurityScheme

▸ **ApiDefineSecurityScheme**(key: *`string`*, securityScheme: *[IApiSecurityScheme](_openapi_interfaces_.md#iapisecurityscheme) \| [IApiReference](../interfaces/_openapi_interfaces_.iapireference.md) \| `function`*): `(Anonymous function)`

*Defined in [openapi/decorators.ts:140](https://github.com/FoalTS/foal/blob/70cc46bd/packages/core/src/openapi/decorators.ts#L140)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| key | `string` |
| securityScheme | [IApiSecurityScheme](_openapi_interfaces_.md#iapisecurityscheme) \| [IApiReference](../interfaces/_openapi_interfaces_.iapireference.md) \| `function` |

**Returns:** `(Anonymous function)`

___
<a id="apidefinetag"></a>

###  ApiDefineTag

▸ **ApiDefineTag**(tag: *[IApiTag](../interfaces/_openapi_interfaces_.iapitag.md) \| `function`*): `(Anonymous function)`

*Defined in [openapi/decorators.ts:57](https://github.com/FoalTS/foal/blob/70cc46bd/packages/core/src/openapi/decorators.ts#L57)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| tag | [IApiTag](../interfaces/_openapi_interfaces_.iapitag.md) \| `function` |

**Returns:** `(Anonymous function)`

___
<a id="apideprecated"></a>

###  ApiDeprecated

▸ **ApiDeprecated**(deprecated?: *`boolean` \| `function`*): `function`

*Defined in [openapi/decorators.ts:100](https://github.com/FoalTS/foal/blob/70cc46bd/packages/core/src/openapi/decorators.ts#L100)*

**Parameters:**

| Name | Type | Default value |
| ------ | ------ | ------ |
| `Default value` deprecated | `boolean` \| `function` | true |

**Returns:** `function`

___
<a id="apiexternaldoc"></a>

###  ApiExternalDoc

▸ **ApiExternalDoc**(externalDoc: *[IApiExternalDocumentation](../interfaces/_openapi_interfaces_.iapiexternaldocumentation.md) \| `function`*): `function`

*Defined in [openapi/decorators.ts:61](https://github.com/FoalTS/foal/blob/70cc46bd/packages/core/src/openapi/decorators.ts#L61)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| externalDoc | [IApiExternalDocumentation](../interfaces/_openapi_interfaces_.iapiexternaldocumentation.md) \| `function` |

**Returns:** `function`

___
<a id="apiinfo"></a>

###  ApiInfo

▸ **ApiInfo**(info: *[IApiInfo](../interfaces/_openapi_interfaces_.iapiinfo.md) \| `function`*): `function`

*Defined in [openapi/decorators.ts:31](https://github.com/FoalTS/foal/blob/70cc46bd/packages/core/src/openapi/decorators.ts#L31)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| info | [IApiInfo](../interfaces/_openapi_interfaces_.iapiinfo.md) \| `function` |

**Returns:** `function`

___
<a id="apioperation"></a>

###  ApiOperation

▸ **ApiOperation**(operation: *[IApiOperation](../interfaces/_openapi_interfaces_.iapioperation.md) \| `function`*): `function`

*Defined in [openapi/decorators.ts:67](https://github.com/FoalTS/foal/blob/70cc46bd/packages/core/src/openapi/decorators.ts#L67)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| operation | [IApiOperation](../interfaces/_openapi_interfaces_.iapioperation.md) \| `function` |

**Returns:** `function`

___
<a id="apioperationdescription"></a>

###  ApiOperationDescription

▸ **ApiOperationDescription**(description: *`string` \| `function`*): `function`

*Defined in [openapi/decorators.ts:35](https://github.com/FoalTS/foal/blob/70cc46bd/packages/core/src/openapi/decorators.ts#L35)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| description | `string` \| `function` |

**Returns:** `function`

___
<a id="apioperationid"></a>

###  ApiOperationId

▸ **ApiOperationId**(operationId: *`string` \| `function`*): `function`

*Defined in [openapi/decorators.ts:39](https://github.com/FoalTS/foal/blob/70cc46bd/packages/core/src/openapi/decorators.ts#L39)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| operationId | `string` \| `function` |

**Returns:** `function`

___
<a id="apioperationsummary"></a>

###  ApiOperationSummary

▸ **ApiOperationSummary**(summary: *`string` \| `function`*): `function`

*Defined in [openapi/decorators.ts:43](https://github.com/FoalTS/foal/blob/70cc46bd/packages/core/src/openapi/decorators.ts#L43)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| summary | `string` \| `function` |

**Returns:** `function`

___
<a id="apiparameter"></a>

###  ApiParameter

▸ **ApiParameter**(parameter: *[IApiParameter](_openapi_interfaces_.md#iapiparameter) \| [IApiReference](../interfaces/_openapi_interfaces_.iapireference.md) \| `function`*): `(Anonymous function)`

*Defined in [openapi/decorators.ts:75](https://github.com/FoalTS/foal/blob/70cc46bd/packages/core/src/openapi/decorators.ts#L75)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| parameter | [IApiParameter](_openapi_interfaces_.md#iapiparameter) \| [IApiReference](../interfaces/_openapi_interfaces_.iapireference.md) \| `function` |

**Returns:** `(Anonymous function)`

___
<a id="apirequestbody"></a>

###  ApiRequestBody

▸ **ApiRequestBody**(requestBody: *[IApiRequestBody](../interfaces/_openapi_interfaces_.iapirequestbody.md) \| [IApiReference](../interfaces/_openapi_interfaces_.iapireference.md) \| `function`*): `function`

*Defined in [openapi/decorators.ts:81](https://github.com/FoalTS/foal/blob/70cc46bd/packages/core/src/openapi/decorators.ts#L81)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| requestBody | [IApiRequestBody](../interfaces/_openapi_interfaces_.iapirequestbody.md) \| [IApiReference](../interfaces/_openapi_interfaces_.iapireference.md) \| `function` |

**Returns:** `function`

___
<a id="apiresponse"></a>

###  ApiResponse

▸ **ApiResponse**(key: *"default" \| "1XX" \| "2XX" \| "3XX" \| "4XX" \| "5XX" \| `number`*, response: *[IApiResponse](../interfaces/_openapi_interfaces_.iapiresponse.md) \| [IApiReference](../interfaces/_openapi_interfaces_.iapireference.md) \| `function`*): `(Anonymous function)`

*Defined in [openapi/decorators.ts:87](https://github.com/FoalTS/foal/blob/70cc46bd/packages/core/src/openapi/decorators.ts#L87)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| key | "default" \| "1XX" \| "2XX" \| "3XX" \| "4XX" \| "5XX" \| `number` |
| response | [IApiResponse](../interfaces/_openapi_interfaces_.iapiresponse.md) \| [IApiReference](../interfaces/_openapi_interfaces_.iapireference.md) \| `function` |

**Returns:** `(Anonymous function)`

___
<a id="apisecurityrequirement"></a>

###  ApiSecurityRequirement

▸ **ApiSecurityRequirement**(securityRequirement: *[IApiSecurityRequirement](../interfaces/_openapi_interfaces_.iapisecurityrequirement.md) \| `function`*): `(Anonymous function)`

*Defined in [openapi/decorators.ts:51](https://github.com/FoalTS/foal/blob/70cc46bd/packages/core/src/openapi/decorators.ts#L51)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| securityRequirement | [IApiSecurityRequirement](../interfaces/_openapi_interfaces_.iapisecurityrequirement.md) \| `function` |

**Returns:** `(Anonymous function)`

___
<a id="apiserver"></a>

###  ApiServer

▸ **ApiServer**(server: *[IApiServer](../interfaces/_openapi_interfaces_.iapiserver.md) \| `function`*): `(Anonymous function)`

*Defined in [openapi/decorators.ts:47](https://github.com/FoalTS/foal/blob/70cc46bd/packages/core/src/openapi/decorators.ts#L47)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| server | [IApiServer](../interfaces/_openapi_interfaces_.iapiserver.md) \| `function` |

**Returns:** `(Anonymous function)`

___
<a id="apiusetag"></a>

###  ApiUseTag

▸ **ApiUseTag**(tag: *`string` \| `function`*): `(Anonymous function)`

*Defined in [openapi/decorators.ts:71](https://github.com/FoalTS/foal/blob/70cc46bd/packages/core/src/openapi/decorators.ts#L71)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| tag | `string` \| `function` |

**Returns:** `(Anonymous function)`

___

