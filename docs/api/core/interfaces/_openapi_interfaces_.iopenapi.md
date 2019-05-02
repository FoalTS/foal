[@foal/core](../README.md) > ["openapi/interfaces"](../modules/_openapi_interfaces_.md) > [IOpenAPI](../interfaces/_openapi_interfaces_.iopenapi.md)

# Interface: IOpenAPI

This is the root document object of the OpenAPI document.

Source: [https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md)

*__export__*: 

*__interface__*: IOpenAPI

## Hierarchy

**IOpenAPI**

## Index

### Properties

* [components](_openapi_interfaces_.iopenapi.md#components)
* [externalDocs](_openapi_interfaces_.iopenapi.md#externaldocs)
* [info](_openapi_interfaces_.iopenapi.md#info)
* [openapi](_openapi_interfaces_.iopenapi.md#openapi)
* [paths](_openapi_interfaces_.iopenapi.md#paths)
* [security](_openapi_interfaces_.iopenapi.md#security)
* [servers](_openapi_interfaces_.iopenapi.md#servers)
* [tags](_openapi_interfaces_.iopenapi.md#tags)

---

## Properties

<a id="components"></a>

### `<Optional>` components

**● components**: *[IApiComponents](_openapi_interfaces_.iapicomponents.md)*

*Defined in [openapi/interfaces.ts:59](https://github.com/FoalTS/foal/blob/7934e4d7/packages/core/src/openapi/interfaces.ts#L59)*

An element to hold various schemas for the specification.

Source: [https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md)

*__type__*: {IApiComponent\[\]}

*__memberof__*: IOpenAPI

___
<a id="externaldocs"></a>

### `<Optional>` externalDocs

**● externalDocs**: *[IApiExternalDocumentation](_openapi_interfaces_.iapiexternaldocumentation.md)*

*Defined in [openapi/interfaces.ts:93](https://github.com/FoalTS/foal/blob/7934e4d7/packages/core/src/openapi/interfaces.ts#L93)*

Additional external documentation.

Source: [https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md)

*__type__*: {IApiExternalDocumentation}

*__memberof__*: IOpenAPI

___
<a id="info"></a>

###  info

**● info**: *[IApiInfo](_openapi_interfaces_.iapiinfo.md)*

*Defined in [openapi/interfaces.ts:30](https://github.com/FoalTS/foal/blob/7934e4d7/packages/core/src/openapi/interfaces.ts#L30)*

Provides metadata about the API. The metadata MAY be used by tooling as required.

Source: [https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md)

*__type__*: {IApiInfo}

*__memberof__*: IOpenAPI

___
<a id="openapi"></a>

###  openapi

**● openapi**: *`string`*

*Defined in [openapi/interfaces.ts:21](https://github.com/FoalTS/foal/blob/7934e4d7/packages/core/src/openapi/interfaces.ts#L21)*

This string MUST be the semantic version number of the OpenAPI Specification version that the OpenAPI document uses. The openapi field SHOULD be used by tooling specifications and clients to interpret the OpenAPI document. This is not related to the API info.version string.

Source: [https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md)

*__type__*: {string}

*__memberof__*: IOpenAPI

___
<a id="paths"></a>

###  paths

**● paths**: *[IApiPaths](_openapi_interfaces_.iapipaths.md)*

*Defined in [openapi/interfaces.ts:50](https://github.com/FoalTS/foal/blob/7934e4d7/packages/core/src/openapi/interfaces.ts#L50)*

The available paths and operations for the API.

Source: [https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md)

*__type__*: {IApiPaths}

*__memberof__*: IOpenAPI

___
<a id="security"></a>

### `<Optional>` security

**● security**: *[IApiSecurityRequirement](_openapi_interfaces_.iapisecurityrequirement.md)[]*

*Defined in [openapi/interfaces.ts:71](https://github.com/FoalTS/foal/blob/7934e4d7/packages/core/src/openapi/interfaces.ts#L71)*

A declaration of which security mechanisms can be used across the API. The list of values includes alternative security requirement objects that can be used. Only one of the security requirement objects need to be satisfied to authorize a request. Individual operations can override this definition.

Source: [https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md)

*__type__*: {IApiSecurityRequirement\[\]}

*__memberof__*: IOpenAPI

___
<a id="servers"></a>

### `<Optional>` servers

**● servers**: *[IApiServer](_openapi_interfaces_.iapiserver.md)[]*

*Defined in [openapi/interfaces.ts:41](https://github.com/FoalTS/foal/blob/7934e4d7/packages/core/src/openapi/interfaces.ts#L41)*

An array of Server Objects, which provide connectivity information to a target server. If the servers property is not provided, or is an empty array, the default value would be a Server Object with a url value of /.

Source: [https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md)

*__type__*: {IApiServer\[\]}

*__memberof__*: IOpenAPI

___
<a id="tags"></a>

### `<Optional>` tags

**● tags**: *[IApiTag](_openapi_interfaces_.iapitag.md)[]*

*Defined in [openapi/interfaces.ts:84](https://github.com/FoalTS/foal/blob/7934e4d7/packages/core/src/openapi/interfaces.ts#L84)*

A list of tags used by the specification with additional metadata. The order of the tags can be used to reflect on their order by the parsing tools. Not all tags that are used by the Operation Object must be declared. The tags that are not declared MAY be organized randomly or based on the tools' logic. Each tag name in the list MUST be unique.

Source: [https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md)

*__type__*: {IApiTag\[\]}

*__memberof__*: IOpenAPI

___

