[@foal/core](../README.md) > ["openapi/openapi.service"](../modules/_openapi_openapi_service_.md) > [OpenAPI](../classes/_openapi_openapi_service_.openapi.md)

# Class: OpenAPI

Service to create OpenAPI documents.

*__export__*: 

*__class__*: OpenAPI

## Hierarchy

**OpenAPI**

## Index

### Properties

* [controllers](_openapi_openapi_service_.openapi.md#controllers)

### Methods

* [createDocument](_openapi_openapi_service_.openapi.md#createdocument)

---

## Properties

<a id="controllers"></a>

###  controllers

**● controllers**: *[ServiceManager](_core_service_manager_.servicemanager.md)*

*Defined in [openapi/openapi.service.ts:13](https://github.com/FoalTS/foal/blob/70cc46bd/packages/core/src/openapi/openapi.service.ts#L13)*

___

## Methods

<a id="createdocument"></a>

###  createDocument

▸ **createDocument**(controllerClass: *[Class](../modules/_core_class_interface_.md#class)*): [IOpenAPI](../interfaces/_openapi_interfaces_.iopenapi.md)

*Defined in [openapi/openapi.service.ts:22](https://github.com/FoalTS/foal/blob/70cc46bd/packages/core/src/openapi/openapi.service.ts#L22)*

Create an OpenAPI document from a controller class.

*__memberof__*: OpenAPI

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| controllerClass | [Class](../modules/_core_class_interface_.md#class) |  The controller class. |

**Returns:** [IOpenAPI](../interfaces/_openapi_interfaces_.iopenapi.md)
The generated OpenAPI document.

___

