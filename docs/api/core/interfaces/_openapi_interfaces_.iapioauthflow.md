[@foal/core](../README.md) > ["openapi/interfaces"](../modules/_openapi_interfaces_.md) > [IApiOAuthFlow](../interfaces/_openapi_interfaces_.iapioauthflow.md)

# Interface: IApiOAuthFlow

Configuration details for a supported OAuth Flow

Source: [https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md)

*__export__*: 

*__interface__*: IApiOAuthFlow

## Hierarchy

**IApiOAuthFlow**

↳  [IApiImplicitOAuthFlow](_openapi_interfaces_.iapiimplicitoauthflow.md)

↳  [IApiPasswordOAuthFlow](_openapi_interfaces_.iapipasswordoauthflow.md)

↳  [IApiClientCredentialsOAuthFlow](_openapi_interfaces_.iapiclientcredentialsoauthflow.md)

↳  [IApiAuthorizationCodeOAuthFlow](_openapi_interfaces_.iapiauthorizationcodeoauthflow.md)

## Index

### Properties

* [refreshUrl](_openapi_interfaces_.iapioauthflow.md#refreshurl)
* [scopes](_openapi_interfaces_.iapioauthflow.md#scopes)

---

## Properties

<a id="refreshurl"></a>

### `<Optional>` refreshUrl

**● refreshUrl**: *`undefined` \| `string`*

*Defined in [openapi/interfaces.ts:2032](https://github.com/FoalTS/foal/blob/70cc46bd/packages/core/src/openapi/interfaces.ts#L2032)*

The URL to be used for obtaining refresh tokens. This MUST be in the form of a URL.

Source: [https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md)

*__type__*: {string}

*__memberof__*: IApiOAuthFlow

___
<a id="scopes"></a>

###  scopes

**● scopes**: *`object`*

*Defined in [openapi/interfaces.ts:2044](https://github.com/FoalTS/foal/blob/70cc46bd/packages/core/src/openapi/interfaces.ts#L2044)*

The available scopes for the OAuth2 security scheme. A map between the scope name and a short description for it.

Source: [https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md)

*__type__*: {{ \[key: string\]: string; }}

*__memberof__*: IApiOAuthFlow

#### Type declaration

[key: `string`]: `string`

___

