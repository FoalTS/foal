[@foal/core](../README.md) > ["openapi/interfaces"](../modules/_openapi_interfaces_.md) > [IApiRequestBody](../interfaces/_openapi_interfaces_.iapirequestbody.md)

# Interface: IApiRequestBody

Describes a single request body.

Source: [https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md)

*__export__*: 

*__interface__*: IApiRequestBody

## Hierarchy

**IApiRequestBody**

## Index

### Properties

* [content](_openapi_interfaces_.iapirequestbody.md#content)
* [description](_openapi_interfaces_.iapirequestbody.md#description)
* [required](_openapi_interfaces_.iapirequestbody.md#required)

---

## Properties

<a id="content"></a>

###  content

**● content**: *`object`*

*Defined in [openapi/interfaces.ts:1022](https://github.com/FoalTS/foal/blob/70cc46bd/packages/core/src/openapi/interfaces.ts#L1022)*

The content of the request body. The key is a media type or media type range and the value describes it. For requests that match multiple keys, only the most specific key is applicable. e.g. text/plain overrides text/\*

Source: [https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md)

*__type__*: {{ \[key: string\]: IApiMediaType; }}

*__memberof__*: IApiRequestBody

#### Type declaration

[key: `string`]: [IApiMediaType](_openapi_interfaces_.iapimediatype.md)

___
<a id="description"></a>

### `<Optional>` description

**● description**: *`undefined` \| `string`*

*Defined in [openapi/interfaces.ts:1009](https://github.com/FoalTS/foal/blob/70cc46bd/packages/core/src/openapi/interfaces.ts#L1009)*

A brief description of the request body. This could contain examples of use. CommonMark syntax MAY be used for rich text representation.

Source: [https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md)

*__type__*: {string}

*__memberof__*: IApiRequestBody

___
<a id="required"></a>

### `<Optional>` required

**● required**: *`undefined` \| `false` \| `true`*

*Defined in [openapi/interfaces.ts:1033](https://github.com/FoalTS/foal/blob/70cc46bd/packages/core/src/openapi/interfaces.ts#L1033)*

Determines if the request body is required in the request. Defaults to false.

Source: [https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md)

*__type__*: {boolean}

*__memberof__*: IApiRequestBody

___

