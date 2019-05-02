[@foal/core](../README.md) > ["openapi/interfaces"](../modules/_openapi_interfaces_.md) > [IApiPasswordOAuthFlow](../interfaces/_openapi_interfaces_.iapipasswordoauthflow.md)

# Interface: IApiPasswordOAuthFlow

## Hierarchy

 [IApiOAuthFlow](_openapi_interfaces_.iapioauthflow.md)

**↳ IApiPasswordOAuthFlow**

## Index

### Properties

* [refreshUrl](_openapi_interfaces_.iapipasswordoauthflow.md#refreshurl)
* [scopes](_openapi_interfaces_.iapipasswordoauthflow.md#scopes)
* [tokenUrl](_openapi_interfaces_.iapipasswordoauthflow.md#tokenurl)

---

## Properties

<a id="refreshurl"></a>

### `<Optional>` refreshUrl

**● refreshUrl**: *`undefined` \| `string`*

*Inherited from [IApiOAuthFlow](_openapi_interfaces_.iapioauthflow.md).[refreshUrl](_openapi_interfaces_.iapioauthflow.md#refreshurl)*

*Defined in [openapi/interfaces.ts:2032](https://github.com/FoalTS/foal/blob/7934e4d7/packages/core/src/openapi/interfaces.ts#L2032)*

The URL to be used for obtaining refresh tokens. This MUST be in the form of a URL.

Source: [https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md)

*__type__*: {string}

*__memberof__*: IApiOAuthFlow

___
<a id="scopes"></a>

###  scopes

**● scopes**: *`object`*

*Inherited from [IApiOAuthFlow](_openapi_interfaces_.iapioauthflow.md).[scopes](_openapi_interfaces_.iapioauthflow.md#scopes)*

*Defined in [openapi/interfaces.ts:2044](https://github.com/FoalTS/foal/blob/7934e4d7/packages/core/src/openapi/interfaces.ts#L2044)*

The available scopes for the OAuth2 security scheme. A map between the scope name and a short description for it.

Source: [https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md)

*__type__*: {{ \[key: string\]: string; }}

*__memberof__*: IApiOAuthFlow

#### Type declaration

[key: `string`]: `string`

___
<a id="tokenurl"></a>

### `<Optional>` tokenUrl

**● tokenUrl**: *`undefined` \| `string`*

*Defined in [openapi/interfaces.ts:2070](https://github.com/FoalTS/foal/blob/7934e4d7/packages/core/src/openapi/interfaces.ts#L2070)*

The token URL to be used for this flow. This MUST be in the form of a URL.

Source: [https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md)

*__type__*: {string}

*__memberof__*: IApiPasswordOAuthFlow

___

