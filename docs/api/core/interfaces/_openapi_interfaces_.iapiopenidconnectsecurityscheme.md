[@foal/core](../README.md) > ["openapi/interfaces"](../modules/_openapi_interfaces_.md) > [IApiOpenIdConnectSecurityScheme](../interfaces/_openapi_interfaces_.iapiopenidconnectsecurityscheme.md)

# Interface: IApiOpenIdConnectSecurityScheme

## Hierarchy

 [IApiAbstractSecurityScheme](_openapi_interfaces_.iapiabstractsecurityscheme.md)

**↳ IApiOpenIdConnectSecurityScheme**

## Index

### Properties

* [description](_openapi_interfaces_.iapiopenidconnectsecurityscheme.md#description)
* [openIdConnectUrl](_openapi_interfaces_.iapiopenidconnectsecurityscheme.md#openidconnecturl)
* [type](_openapi_interfaces_.iapiopenidconnectsecurityscheme.md#type)

---

## Properties

<a id="description"></a>

### `<Optional>` description

**● description**: *`undefined` \| `string`*

*Inherited from [IApiAbstractSecurityScheme](_openapi_interfaces_.iapiabstractsecurityscheme.md).[description](_openapi_interfaces_.iapiabstractsecurityscheme.md#description)*

*Defined in [openapi/interfaces.ts:1876](https://github.com/FoalTS/foal/blob/538afb23/packages/core/src/openapi/interfaces.ts#L1876)*

A short description for security scheme. CommonMark syntax MAY be used for rich text representation.

Source: [https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md)

*__type__*: {string}

*__memberof__*: IApiAbstractSecurityScheme

___
<a id="openidconnecturl"></a>

###  openIdConnectUrl

**● openIdConnectUrl**: *`string`*

*Defined in [openapi/interfaces.ts:1950](https://github.com/FoalTS/foal/blob/538afb23/packages/core/src/openapi/interfaces.ts#L1950)*

OpenId Connect URL to discover OAuth2 configuration values. This MUST be in the form of a URL.

Source: [https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md)

*__type__*: {string}

*__memberof__*: IApiOpenIdConnectSecurityScheme

___
<a id="type"></a>

###  type

**● type**: *"openIdConnect"*

*Overrides [IApiAbstractSecurityScheme](_openapi_interfaces_.iapiabstractsecurityscheme.md).[type](_openapi_interfaces_.iapiabstractsecurityscheme.md#type)*

*Defined in [openapi/interfaces.ts:1940](https://github.com/FoalTS/foal/blob/538afb23/packages/core/src/openapi/interfaces.ts#L1940)*

___

