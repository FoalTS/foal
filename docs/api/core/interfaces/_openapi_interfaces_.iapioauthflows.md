[@foal/core](../README.md) > ["openapi/interfaces"](../modules/_openapi_interfaces_.md) > [IApiOAuthFlows](../interfaces/_openapi_interfaces_.iapioauthflows.md)

# Interface: IApiOAuthFlows

Allows configuration of the supported OAuth Flows.

Source: [https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md)

*__export__*: 

*__interface__*: IApiOAuthFlows

## Hierarchy

**IApiOAuthFlows**

## Index

### Properties

* [authorizationCode](_openapi_interfaces_.iapioauthflows.md#authorizationcode)
* [clientCredentials](_openapi_interfaces_.iapioauthflows.md#clientcredentials)
* [implicit](_openapi_interfaces_.iapioauthflows.md#implicit)
* [password](_openapi_interfaces_.iapioauthflows.md#password)

---

## Properties

<a id="authorizationcode"></a>

### `<Optional>` authorizationCode

**● authorizationCode**: *[IApiAuthorizationCodeOAuthFlow](_openapi_interfaces_.iapiauthorizationcodeoauthflow.md)*

*Defined in [openapi/interfaces.ts:2012](https://github.com/FoalTS/foal/blob/cf326d07/packages/core/src/openapi/interfaces.ts#L2012)*

Configuration for the OAuth Authorization Code flow. Previously called accessCode in OpenAPI 2.0.

Source: [https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md)

*__type__*: {IApiOAuthFlow}

*__memberof__*: IApiOAuthFlows

___
<a id="clientcredentials"></a>

### `<Optional>` clientCredentials

**● clientCredentials**: *[IApiClientCredentialsOAuthFlow](_openapi_interfaces_.iapiclientcredentialsoauthflow.md)*

*Defined in [openapi/interfaces.ts:2002](https://github.com/FoalTS/foal/blob/cf326d07/packages/core/src/openapi/interfaces.ts#L2002)*

Configuration for the OAuth Client Credentials flow. Previously called application in OpenAPI 2.0.

Source: [https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md)

*__type__*: {IApiOAuthFlow}

*__memberof__*: IApiOAuthFlows

___
<a id="implicit"></a>

### `<Optional>` implicit

**● implicit**: *[IApiImplicitOAuthFlow](_openapi_interfaces_.iapiimplicitoauthflow.md)*

*Defined in [openapi/interfaces.ts:1983](https://github.com/FoalTS/foal/blob/cf326d07/packages/core/src/openapi/interfaces.ts#L1983)*

Configuration for the OAuth Implicit flow

Source: [https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md)

*__type__*: {IApiOAuthFlow}

*__memberof__*: IApiOAuthFlows

___
<a id="password"></a>

### `<Optional>` password

**● password**: *[IApiPasswordOAuthFlow](_openapi_interfaces_.iapipasswordoauthflow.md)*

*Defined in [openapi/interfaces.ts:1992](https://github.com/FoalTS/foal/blob/cf326d07/packages/core/src/openapi/interfaces.ts#L1992)*

Configuration for the OAuth Resource Owner Password flow

Source: [https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md)

*__type__*: {IApiOAuthFlow}

*__memberof__*: IApiOAuthFlows

___

