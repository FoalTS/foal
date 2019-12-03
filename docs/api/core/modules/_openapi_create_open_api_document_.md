[@foal/core](../README.md) > ["openapi/create-open-api-document"](../modules/_openapi_create_open_api_document_.md)

# External module: "openapi/create-open-api-document"

## Index

### Functions

* [createOpenApiDocument](_openapi_create_open_api_document_.md#createopenapidocument)
* [getPaths](_openapi_create_open_api_document_.md#getpaths)
* [throwErrorIfDuplicatePaths](_openapi_create_open_api_document_.md#throwerrorifduplicatepaths)

---

## Functions

<a id="createopenapidocument"></a>

###  createOpenApiDocument

▸ **createOpenApiDocument**(controllerClass: *[Class](_core_class_interface_.md#class)*, controllers?: *[ServiceManager](../classes/_core_service_manager_.servicemanager.md)*): [IOpenAPI](../interfaces/_openapi_interfaces_.iopenapi.md)

*Defined in [openapi/create-open-api-document.ts:99](https://github.com/FoalTS/foal/blob/70cc46bd/packages/core/src/openapi/create-open-api-document.ts#L99)*

Create an OpenAPI document from a controller class.

*__export__*: 

**Parameters:**

| Name | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| controllerClass | [Class](_core_class_interface_.md#class) | - |  The controller class. |
| `Default value` controllers | [ServiceManager](../classes/_core_service_manager_.servicemanager.md) |  new ServiceManager() |

**Returns:** [IOpenAPI](../interfaces/_openapi_interfaces_.iopenapi.md)
The generate OpenAPI document.

___
<a id="getpaths"></a>

###  getPaths

▸ **getPaths**(controllerClass: *[Class](_core_class_interface_.md#class)*, operation: *[IApiOperation](../interfaces/_openapi_interfaces_.iapioperation.md)*, controllers: *[ServiceManager](../classes/_core_service_manager_.servicemanager.md)*): `object`

*Defined in [openapi/create-open-api-document.ts:28](https://github.com/FoalTS/foal/blob/70cc46bd/packages/core/src/openapi/create-open-api-document.ts#L28)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| controllerClass | [Class](_core_class_interface_.md#class) |
| operation | [IApiOperation](../interfaces/_openapi_interfaces_.iapioperation.md) |
| controllers | [ServiceManager](../classes/_core_service_manager_.servicemanager.md) |

**Returns:** `object`

___
<a id="throwerrorifduplicatepaths"></a>

###  throwErrorIfDuplicatePaths

▸ **throwErrorIfDuplicatePaths**(paths: *[IApiPaths](../interfaces/_openapi_interfaces_.iapipaths.md)*): `void`

*Defined in [openapi/create-open-api-document.ts:9](https://github.com/FoalTS/foal/blob/70cc46bd/packages/core/src/openapi/create-open-api-document.ts#L9)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| paths | [IApiPaths](../interfaces/_openapi_interfaces_.iapipaths.md) |

**Returns:** `void`

___

