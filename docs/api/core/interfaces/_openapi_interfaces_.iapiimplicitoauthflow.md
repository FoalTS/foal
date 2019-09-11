[@foal/core](../README.md) > ["openapi/interfaces"](../modules/_openapi_interfaces_.md) > [IApiImplicitOAuthFlow](../interfaces/_openapi_interfaces_.iapiimplicitoauthflow.md)

# Interface: IApiImplicitOAuthFlow

## Hierarchy

 [IApiOAuthFlow](_openapi_interfaces_.iapioauthflow.md)

**↳ IApiImplicitOAuthFlow**

## Index

### Properties

* [authorizationUrl](_openapi_interfaces_.iapiimplicitoauthflow.md#authorizationurl)
* [refreshUrl](_openapi_interfaces_.iapiimplicitoauthflow.md#refreshurl)
* [scopes](_openapi_interfaces_.iapiimplicitoauthflow.md#scopes)

---

## Properties

<a id="authorizationurl"></a>

### `<Optional>` authorizationUrl

**● authorizationUrl**: *`undefined` \| `string`*

*Defined in [openapi/interfaces.ts:2058](https://github.com/FoalTS/foal/blob/aac11366/packages/core/src/openapi/interfaces.ts#L2058)*

The authorization URL to be used for this flow. This MUST be in the form of a URL.

Source: [https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md)

*__type__*: {string}

*__memberof__*: IApiImplicitOAuthFlow

___
<a id="refreshurl"></a>

### `<Optional>` refreshUrl

**● refreshUrl**: *`undefined` \| `string`*

*Inherited from [IApiOAuthFlow](_openapi_interfaces_.iapioauthflow.md).[refreshUrl](_openapi_interfaces_.iapioauthflow.md#refreshurl)*

*Defined in [openapi/interfaces.ts:2032](https://github.com/FoalTS/foal/blob/aac11366/packages/core/src/openapi/interfaces.ts#L2032)*

The URL to be used for obtaining refresh tokens. This MUST be in the form of a URL.

Source: [https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md)

*__type__*: {string}

*__memberof__*: IApiOAuthFlow

___
<a id="scopes"></a>

###  scopes

**● scopes**: *`object`*

*Inherited from [IApiOAuthFlow](_openapi_interfaces_.iapioauthflow.md).[scopes](_openapi_interfaces_.iapioauthflow.md#scopes)*

*Defined in [openapi/interfaces.ts:2044](https://github.com/FoalTS/foal/blob/aac11366/packages/core/src/openapi/interfaces.ts#L2044)*

The available scopes for the OAuth2 security scheme. A map between the scope name and a short description for it.

Source: [https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md)

*__type__*: {{ \[key: string\]: string; }}

*__memberof__*: IApiOAuthFlow

#### Type declaration

[key: `string`]: `string`

___

