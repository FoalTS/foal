[@foal/core](../README.md) > ["openapi/interfaces"](../modules/_openapi_interfaces_.md) > [IApiApiKeySecurityScheme](../interfaces/_openapi_interfaces_.iapiapikeysecurityscheme.md)

# Interface: IApiApiKeySecurityScheme

## Hierarchy

 [IApiAbstractSecurityScheme](_openapi_interfaces_.iapiabstractsecurityscheme.md)

**↳ IApiApiKeySecurityScheme**

## Index

### Properties

* [description](_openapi_interfaces_.iapiapikeysecurityscheme.md#description)
* [in](_openapi_interfaces_.iapiapikeysecurityscheme.md#in)
* [name](_openapi_interfaces_.iapiapikeysecurityscheme.md#name)
* [type](_openapi_interfaces_.iapiapikeysecurityscheme.md#type)

---

## Properties

<a id="description"></a>

### `<Optional>` description

**● description**: *`undefined` \| `string`*

*Inherited from [IApiAbstractSecurityScheme](_openapi_interfaces_.iapiabstractsecurityscheme.md).[description](_openapi_interfaces_.iapiabstractsecurityscheme.md#description)*

*Defined in [openapi/interfaces.ts:1876](https://github.com/FoalTS/foal/blob/cf326d07/packages/core/src/openapi/interfaces.ts#L1876)*

A short description for security scheme. CommonMark syntax MAY be used for rich text representation.

Source: [https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md)

*__type__*: {string}

*__memberof__*: IApiAbstractSecurityScheme

___
<a id="in"></a>

###  in

**● in**: *"query" \| "header" \| "cookie"*

*Defined in [openapi/interfaces.ts:1898](https://github.com/FoalTS/foal/blob/cf326d07/packages/core/src/openapi/interfaces.ts#L1898)*

The location of the API key. Valid values are "query", "header" or "cookie".

Source: [https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md)

*__type__*: {('query'\|'header'\|'cookie')}

*__memberof__*: IApiApiKeySecurityScheme

___
<a id="name"></a>

###  name

**● name**: *`string`*

*Defined in [openapi/interfaces.ts:1889](https://github.com/FoalTS/foal/blob/cf326d07/packages/core/src/openapi/interfaces.ts#L1889)*

The name of the header, query or cookie parameter to be used.

Source: [https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md)

*__type__*: {string}

*__memberof__*: IApiApiKeySecurityScheme

___
<a id="type"></a>

###  type

**● type**: *"apiKey"*

*Overrides [IApiAbstractSecurityScheme](_openapi_interfaces_.iapiabstractsecurityscheme.md).[type](_openapi_interfaces_.iapiabstractsecurityscheme.md#type)*

*Defined in [openapi/interfaces.ts:1880](https://github.com/FoalTS/foal/blob/cf326d07/packages/core/src/openapi/interfaces.ts#L1880)*

___

