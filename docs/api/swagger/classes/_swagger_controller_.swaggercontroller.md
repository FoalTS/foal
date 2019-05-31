[@foal/swagger](../README.md) > ["swagger-controller"](../modules/_swagger_controller_.md) > [SwaggerController](../classes/_swagger_controller_.swaggercontroller.md)

# Class: SwaggerController

Serve Swagger UI to visualize and interact with API resources.

*__export__*: 

*__abstract__*: 

*__class__*: SwaggerController

## Hierarchy

**SwaggerController**

## Index

### Properties

* [options](_swagger_controller_.swaggercontroller.md#options)

### Methods

* [getOpenApiDefinition](_swagger_controller_.swaggercontroller.md#getopenapidefinition)
* [index](_swagger_controller_.swaggercontroller.md#index)
* [swaggerUi](_swagger_controller_.swaggercontroller.md#swaggerui)
* [swaggerUiBundle](_swagger_controller_.swaggercontroller.md#swaggeruibundle)
* [swaggerUiStandalonePreset](_swagger_controller_.swaggercontroller.md#swaggeruistandalonepreset)

---

## Properties

<a id="options"></a>

### `<Abstract>` options

**● options**: *`object` \| `object` \| (`object` \| `object`)[]*

*Defined in [swagger-controller.ts:41](https://github.com/FoalTS/foal/blob/cf326d07/packages/swagger/src/swagger-controller.ts#L41)*

Specify the OpenAPI Specification(s) and their location(s).

If a controller class is provided, then an OpenAPI Specification is generated from its definition.

*__abstract__*: 

*__type__*: {({ url: string } \| { controllerClass: Class } \| ( { name: string, url: string, primary?: boolean } \| { name: string, controllerClass: Class, primary?: boolean } )\[\])}

*__memberof__*: SwaggerController

___

## Methods

<a id="getopenapidefinition"></a>

###  getOpenApiDefinition

▸ **getOpenApiDefinition**(ctx: *`Context`*): `HttpResponseNotFound` \| `HttpResponseOK` \| `HttpResponseBadRequest`

*Defined in [swagger-controller.ts:51](https://github.com/FoalTS/foal/blob/cf326d07/packages/swagger/src/swagger-controller.ts#L51)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| ctx | `Context` |

**Returns:** `HttpResponseNotFound` \| `HttpResponseOK` \| `HttpResponseBadRequest`

___
<a id="index"></a>

###  index

▸ **index**(ctx: *`Context`*): `Promise`<`HttpResponseOK` \| `HttpResponseMovedPermanently`>

*Defined in [swagger-controller.ts:77](https://github.com/FoalTS/foal/blob/cf326d07/packages/swagger/src/swagger-controller.ts#L77)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| ctx | `Context` |

**Returns:** `Promise`<`HttpResponseOK` \| `HttpResponseMovedPermanently`>

___
<a id="swaggerui"></a>

###  swaggerUi

▸ **swaggerUi**(): `Promise`<`HttpResponseOK`>

*Defined in [swagger-controller.ts:113](https://github.com/FoalTS/foal/blob/cf326d07/packages/swagger/src/swagger-controller.ts#L113)*

**Returns:** `Promise`<`HttpResponseOK`>

___
<a id="swaggeruibundle"></a>

###  swaggerUiBundle

▸ **swaggerUiBundle**(): `Promise`<`HttpResponseOK`>

*Defined in [swagger-controller.ts:121](https://github.com/FoalTS/foal/blob/cf326d07/packages/swagger/src/swagger-controller.ts#L121)*

**Returns:** `Promise`<`HttpResponseOK`>

___
<a id="swaggeruistandalonepreset"></a>

###  swaggerUiStandalonePreset

▸ **swaggerUiStandalonePreset**(): `Promise`<`HttpResponseOK`>

*Defined in [swagger-controller.ts:129](https://github.com/FoalTS/foal/blob/cf326d07/packages/swagger/src/swagger-controller.ts#L129)*

**Returns:** `Promise`<`HttpResponseOK`>

___

