[@foal/core](../README.md) > ["openapi/interfaces"](../modules/_openapi_interfaces_.md) > [IApiInfo](../interfaces/_openapi_interfaces_.iapiinfo.md)

# Interface: IApiInfo

The object provides metadata about the API. The metadata MAY be used by the clients if needed, and MAY be presented in editing or documentation generation tools for convenience.

Source: [https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md)

*__export__*: 

*__interface__*: IApiInfo

## Hierarchy

**IApiInfo**

## Index

### Properties

* [contact](_openapi_interfaces_.iapiinfo.md#contact)
* [description](_openapi_interfaces_.iapiinfo.md#description)
* [license](_openapi_interfaces_.iapiinfo.md#license)
* [termsOfService](_openapi_interfaces_.iapiinfo.md#termsofservice)
* [title](_openapi_interfaces_.iapiinfo.md#title)
* [version](_openapi_interfaces_.iapiinfo.md#version)

---

## Properties

<a id="contact"></a>

### `<Optional>` contact

**● contact**: *[IApiContact](_openapi_interfaces_.iapicontact.md)*

*Defined in [openapi/interfaces.ts:143](https://github.com/FoalTS/foal/blob/07f00115/packages/core/src/openapi/interfaces.ts#L143)*

The contact information for the exposed API.

Source: [https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md)

*__type__*: {IApiContact}

*__memberof__*: IApiInfo

___
<a id="description"></a>

### `<Optional>` description

**● description**: *`undefined` \| `string`*

*Defined in [openapi/interfaces.ts:125](https://github.com/FoalTS/foal/blob/07f00115/packages/core/src/openapi/interfaces.ts#L125)*

A short description of the application. CommonMark syntax MAY be used for rich text representation.

Source: [https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md)

*__type__*: {string}

*__memberof__*: IApiInfo

___
<a id="license"></a>

### `<Optional>` license

**● license**: *[IApiLicense](_openapi_interfaces_.iapilicense.md)*

*Defined in [openapi/interfaces.ts:152](https://github.com/FoalTS/foal/blob/07f00115/packages/core/src/openapi/interfaces.ts#L152)*

The license information for the exposed API.

Source: [https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md)

*__type__*: {IApiLicense}

*__memberof__*: IApiInfo

___
<a id="termsofservice"></a>

### `<Optional>` termsOfService

**● termsOfService**: *`undefined` \| `string`*

*Defined in [openapi/interfaces.ts:134](https://github.com/FoalTS/foal/blob/07f00115/packages/core/src/openapi/interfaces.ts#L134)*

A URL to the Terms of Service for the API. MUST be in the format of a URL.

Source: [https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md)

*__type__*: {string}

*__memberof__*: IApiInfo

___
<a id="title"></a>

###  title

**● title**: *`string`*

*Defined in [openapi/interfaces.ts:115](https://github.com/FoalTS/foal/blob/07f00115/packages/core/src/openapi/interfaces.ts#L115)*

The title of the application.

Source: [https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md)

*__type__*: {string}

*__memberof__*: IApiInfo

___
<a id="version"></a>

###  version

**● version**: *`string`*

*Defined in [openapi/interfaces.ts:162](https://github.com/FoalTS/foal/blob/07f00115/packages/core/src/openapi/interfaces.ts#L162)*

The version of the OpenAPI document (which is distinct from the OpenAPI Specification version or the API implementation version).

Source: [https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md)

*__type__*: {string}

*__memberof__*: IApiInfo

___

