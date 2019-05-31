[@foal/core](../README.md) > ["openapi/interfaces"](../modules/_openapi_interfaces_.md) > [IApiOAuth2SecurityScheme](../interfaces/_openapi_interfaces_.iapioauth2securityscheme.md)

# Interface: IApiOAuth2SecurityScheme

## Hierarchy

 [IApiAbstractSecurityScheme](_openapi_interfaces_.iapiabstractsecurityscheme.md)

**↳ IApiOAuth2SecurityScheme**

## Index

### Properties

* [description](_openapi_interfaces_.iapioauth2securityscheme.md#description)
* [flows](_openapi_interfaces_.iapioauth2securityscheme.md#flows)
* [type](_openapi_interfaces_.iapioauth2securityscheme.md#type)

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
<a id="flows"></a>

###  flows

**● flows**: *[IApiOAuthFlows](_openapi_interfaces_.iapioauthflows.md)*

*Defined in [openapi/interfaces.ts:1936](https://github.com/FoalTS/foal/blob/cf326d07/packages/core/src/openapi/interfaces.ts#L1936)*

An object containing configuration information for the flow types supported.

Source: [https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md)

*__type__*: {IApiOAuthFlows}

*__memberof__*: IApiOAuth2SecurityScheme

___
<a id="type"></a>

###  type

**● type**: *"oauth2"*

*Overrides [IApiAbstractSecurityScheme](_openapi_interfaces_.iapiabstractsecurityscheme.md).[type](_openapi_interfaces_.iapiabstractsecurityscheme.md#type)*

*Defined in [openapi/interfaces.ts:1927](https://github.com/FoalTS/foal/blob/cf326d07/packages/core/src/openapi/interfaces.ts#L1927)*

___

