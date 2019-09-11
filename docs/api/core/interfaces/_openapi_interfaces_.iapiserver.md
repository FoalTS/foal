[@foal/core](../README.md) > ["openapi/interfaces"](../modules/_openapi_interfaces_.md) > [IApiServer](../interfaces/_openapi_interfaces_.iapiserver.md)

# Interface: IApiServer

An object representing a Server.

Source: [https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md)

*__export__*: 

*__interface__*: IApiServer

## Hierarchy

**IApiServer**

## Index

### Properties

* [description](_openapi_interfaces_.iapiserver.md#description)
* [url](_openapi_interfaces_.iapiserver.md#url)
* [variables](_openapi_interfaces_.iapiserver.md#variables)

---

## Properties

<a id="description"></a>

### `<Optional>` description

**● description**: *`undefined` \| `string`*

*Defined in [openapi/interfaces.ts:263](https://github.com/FoalTS/foal/blob/aac11366/packages/core/src/openapi/interfaces.ts#L263)*

An optional string describing the host designated by the URL. CommonMark syntax MAY be used for rich text representation.

Source: [https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md)

*__type__*: {string}

*__memberof__*: IApiServer

___
<a id="url"></a>

###  url

**● url**: *`string`*

*Defined in [openapi/interfaces.ts:253](https://github.com/FoalTS/foal/blob/aac11366/packages/core/src/openapi/interfaces.ts#L253)*

A URL to the target host. This URL supports Server Variables and MAY be relative, to indicate that the host location is relative to the location where the OpenAPI document is being served. Variable substitutions will be made when a variable is named in {brackets}.

Source: [https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md)

*__type__*: {string}

*__memberof__*: IApiServer

___
<a id="variables"></a>

### `<Optional>` variables

**● variables**: *`undefined` \| `object`*

*Defined in [openapi/interfaces.ts:275](https://github.com/FoalTS/foal/blob/aac11366/packages/core/src/openapi/interfaces.ts#L275)*

A map between a variable name and its value. The value is used for substitution in the server's URL template.

Source: [https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md)

*__type__*: {{ \[key: string\]: IApiServerVariable; }}

*__memberof__*: IApiServer

___

