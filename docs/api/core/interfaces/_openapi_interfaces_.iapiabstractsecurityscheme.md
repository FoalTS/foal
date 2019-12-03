[@foal/core](../README.md) > ["openapi/interfaces"](../modules/_openapi_interfaces_.md) > [IApiAbstractSecurityScheme](../interfaces/_openapi_interfaces_.iapiabstractsecurityscheme.md)

# Interface: IApiAbstractSecurityScheme

## Hierarchy

**IApiAbstractSecurityScheme**

↳  [IApiApiKeySecurityScheme](_openapi_interfaces_.iapiapikeysecurityscheme.md)

↳  [IApiHttpSecurityScheme](_openapi_interfaces_.iapihttpsecurityscheme.md)

↳  [IApiOAuth2SecurityScheme](_openapi_interfaces_.iapioauth2securityscheme.md)

↳  [IApiOpenIdConnectSecurityScheme](_openapi_interfaces_.iapiopenidconnectsecurityscheme.md)

## Index

### Properties

* [description](_openapi_interfaces_.iapiabstractsecurityscheme.md#description)
* [type](_openapi_interfaces_.iapiabstractsecurityscheme.md#type)

---

## Properties

<a id="description"></a>

### `<Optional>` description

**● description**: *`undefined` \| `string`*

*Defined in [openapi/interfaces.ts:1876](https://github.com/FoalTS/foal/blob/70cc46bd/packages/core/src/openapi/interfaces.ts#L1876)*

A short description for security scheme. CommonMark syntax MAY be used for rich text representation.

Source: [https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md)

*__type__*: {string}

*__memberof__*: IApiAbstractSecurityScheme

___
<a id="type"></a>

###  type

**● type**: *"apiKey" \| "http" \| "oauth2" \| "openIdConnect"*

*Defined in [openapi/interfaces.ts:1866](https://github.com/FoalTS/foal/blob/70cc46bd/packages/core/src/openapi/interfaces.ts#L1866)*

The type of the security scheme. Valid values are "apiKey", "http", "oauth2", "openIdConnect".

Source: [https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md)

*__type__*: {('apiKey'\|'http'\|'oauth2'\|'openIdConnect')}

*__memberof__*: IApiAbstractSecurityScheme

___

