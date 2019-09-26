[@foal/core](../README.md) > ["openapi/interfaces"](../modules/_openapi_interfaces_.md) > [IApiExternalDocumentation](../interfaces/_openapi_interfaces_.iapiexternaldocumentation.md)

# Interface: IApiExternalDocumentation

Allows referencing an external resource for extended documentation.

Source: [https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md)

*__export__*: 

*__interface__*: IApiExternalDocumentation

## Hierarchy

**IApiExternalDocumentation**

## Index

### Properties

* [description](_openapi_interfaces_.iapiexternaldocumentation.md#description)
* [url](_openapi_interfaces_.iapiexternaldocumentation.md#url)

---

## Properties

<a id="description"></a>

### `<Optional>` description

**● description**: *`undefined` \| `string`*

*Defined in [openapi/interfaces.ts:781](https://github.com/FoalTS/foal/blob/538afb23/packages/core/src/openapi/interfaces.ts#L781)*

A short description of the target documentation. CommonMark syntax MAY be used for rich text representation.

Source: [https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md)

*__type__*: {string}

*__memberof__*: IApiExternalDocumentation

___
<a id="url"></a>

###  url

**● url**: *`string`*

*Defined in [openapi/interfaces.ts:790](https://github.com/FoalTS/foal/blob/538afb23/packages/core/src/openapi/interfaces.ts#L790)*

The URL for the target documentation. Value MUST be in the format of a URL.

Source: [https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md)

*__type__*: {string}

*__memberof__*: IApiExternalDocumentation

___

