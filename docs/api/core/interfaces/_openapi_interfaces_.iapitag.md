[@foal/core](../README.md) > ["openapi/interfaces"](../modules/_openapi_interfaces_.md) > [IApiTag](../interfaces/_openapi_interfaces_.iapitag.md)

# Interface: IApiTag

Adds metadata to a single tag that is used by the Operation Object. It is not mandatory to have a Tag Object per tag defined in the Operation Object instances.

Source: [https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md)

*__export__*: 

*__interface__*: IApiTag

## Hierarchy

**IApiTag**

## Index

### Properties

* [description](_openapi_interfaces_.iapitag.md#description)
* [externalDocs](_openapi_interfaces_.iapitag.md#externaldocs)
* [name](_openapi_interfaces_.iapitag.md#name)

---

## Properties

<a id="description"></a>

### `<Optional>` description

**● description**: *`undefined` \| `string`*

*Defined in [openapi/interfaces.ts:1580](https://github.com/FoalTS/foal/blob/aac11366/packages/core/src/openapi/interfaces.ts#L1580)*

A short description for the tag. CommonMark syntax MAY be used for rich text representation.

Source: [https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md)

*__type__*: {string}

*__memberof__*: IApiTag

___
<a id="externaldocs"></a>

### `<Optional>` externalDocs

**● externalDocs**: *[IApiExternalDocumentation](_openapi_interfaces_.iapiexternaldocumentation.md)*

*Defined in [openapi/interfaces.ts:1589](https://github.com/FoalTS/foal/blob/aac11366/packages/core/src/openapi/interfaces.ts#L1589)*

Additional external documentation for this tag.

Source: [https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md)

*__type__*: {IApiExternalDocumentation}

*__memberof__*: IApiTag

___
<a id="name"></a>

###  name

**● name**: *`string`*

*Defined in [openapi/interfaces.ts:1570](https://github.com/FoalTS/foal/blob/aac11366/packages/core/src/openapi/interfaces.ts#L1570)*

The name of the tag.

Source: [https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md)

*__type__*: {string}

*__memberof__*: IApiTag

___

