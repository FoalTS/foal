[@foal/social](../README.md) > ["abstract-provider.service"](../modules/_abstract_provider_service_.md) > [AbstractProvider](../classes/_abstract_provider_service_.abstractprovider.md)

# Class: AbstractProvider

Abstract class that any social provider must inherit from.

*__export__*: 

*__abstract__*: 

*__class__*: AbstractProvider

*__template__*: AuthParameters - Additional parameters to pass to the auth endpoint.

*__template__*: UserInfoParameters - Additional parameters to pass when retrieving user information.

## Type parameters
#### AuthParameters :  [ObjectType](../interfaces/_abstract_provider_service_.objecttype.md)
#### UserInfoParameters :  [ObjectType](../interfaces/_abstract_provider_service_.objecttype.md)
## Hierarchy

**AbstractProvider**

↳  [GoogleProvider](_google_provider_service_.googleprovider.md)

↳  [FacebookProvider](_facebook_provider_service_.facebookprovider.md)

## Index

### Properties

* [authEndpoint](_abstract_provider_service_.abstractprovider.md#authendpoint)
* [configInstance](_abstract_provider_service_.abstractprovider.md#configinstance)
* [configPaths](_abstract_provider_service_.abstractprovider.md#configpaths)
* [defaultScopes](_abstract_provider_service_.abstractprovider.md#defaultscopes)
* [scopeSeparator](_abstract_provider_service_.abstractprovider.md#scopeseparator)
* [tokenEndpoint](_abstract_provider_service_.abstractprovider.md#tokenendpoint)

### Accessors

* [config](_abstract_provider_service_.abstractprovider.md#config)

### Methods

* [getState](_abstract_provider_service_.abstractprovider.md#getstate)
* [getTokens](_abstract_provider_service_.abstractprovider.md#gettokens)
* [getUserInfo](_abstract_provider_service_.abstractprovider.md#getuserinfo)
* [getUserInfoFromTokens](_abstract_provider_service_.abstractprovider.md#getuserinfofromtokens)
* [redirect](_abstract_provider_service_.abstractprovider.md#redirect)

---

## Properties

<a id="authendpoint"></a>

### `<Protected>``<Abstract>` authEndpoint

**● authEndpoint**: *`string`*

*Defined in [abstract-provider.service.ts:117](https://github.com/FoalTS/foal/blob/70cc46bd/packages/social/src/abstract-provider.service.ts#L117)*

URL of the authorization endpoint from which we retrieve an authorization code.

*__abstract__*: 

*__type__*: {string}

*__memberof__*: AbstractProvider

___
<a id="configinstance"></a>

###  configInstance

**● configInstance**: *`Config`*

*Defined in [abstract-provider.service.ts:90](https://github.com/FoalTS/foal/blob/70cc46bd/packages/social/src/abstract-provider.service.ts#L90)*

___
<a id="configpaths"></a>

### `<Protected>``<Abstract>` configPaths

**● configPaths**: *`object`*

*Defined in [abstract-provider.service.ts:104](https://github.com/FoalTS/foal/blob/70cc46bd/packages/social/src/abstract-provider.service.ts#L104)*

Configuration paths from which the client ID, client secret and redirect URI must be retrieved.

*__abstract__*: 

*__type__*: {{ clientId: string; clientSecret: string; redirectUri: string; }}

*__memberof__*: AbstractProvider

#### Type declaration

 clientId: `string`

 clientSecret: `string`

 redirectUri: `string`

___
<a id="defaultscopes"></a>

### `<Protected>` defaultScopes

**● defaultScopes**: *`string`[]* =  []

*Defined in [abstract-provider.service.ts:135](https://github.com/FoalTS/foal/blob/70cc46bd/packages/social/src/abstract-provider.service.ts#L135)*

Default scopes requested by the social provider.

*__type__*: {string\[\]}

*__memberof__*: AbstractProvider

___
<a id="scopeseparator"></a>

### `<Protected>` scopeSeparator

**● scopeSeparator**: *`string`* = " "

*Defined in [abstract-provider.service.ts:144](https://github.com/FoalTS/foal/blob/70cc46bd/packages/social/src/abstract-provider.service.ts#L144)*

Character used to separate the scopes in the URL.

*__type__*: {string}

*__memberof__*: AbstractProvider

___
<a id="tokenendpoint"></a>

### `<Protected>``<Abstract>` tokenEndpoint

**● tokenEndpoint**: *`string`*

*Defined in [abstract-provider.service.ts:126](https://github.com/FoalTS/foal/blob/70cc46bd/packages/social/src/abstract-provider.service.ts#L126)*

URL of the token endpoint from which we retrieve an access token.

*__abstract__*: 

*__type__*: {string}

*__memberof__*: AbstractProvider

___

## Accessors

<a id="config"></a>

### `<Private>` config

**get config**(): `object`

*Defined in [abstract-provider.service.ts:146](https://github.com/FoalTS/foal/blob/70cc46bd/packages/social/src/abstract-provider.service.ts#L146)*

**Returns:** `object`

___

## Methods

<a id="getstate"></a>

### `<Private>` getState

▸ **getState**(): `Promise`<`string`>

*Defined in [abstract-provider.service.ts:268](https://github.com/FoalTS/foal/blob/70cc46bd/packages/social/src/abstract-provider.service.ts#L268)*

**Returns:** `Promise`<`string`>

___
<a id="gettokens"></a>

###  getTokens

▸ **getTokens**(ctx: *`Context`*): `Promise`<[SocialTokens](../interfaces/_abstract_provider_service_.socialtokens.md)>

*Defined in [abstract-provider.service.ts:219](https://github.com/FoalTS/foal/blob/70cc46bd/packages/social/src/abstract-provider.service.ts#L219)*

Function to use in the controller method that handles the provider redirection.

It returns an access token.

*__memberof__*: AbstractProvider

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| ctx | `Context` |  The request context. |

**Returns:** `Promise`<[SocialTokens](../interfaces/_abstract_provider_service_.socialtokens.md)>
The tokens (it contains at least an access token).

___
<a id="getuserinfo"></a>

###  getUserInfo

▸ **getUserInfo**<`UserInfo`>(ctx: *`Context`*, params?: *[UserInfoParameters]()*): `Promise`<[UserInfoAndTokens](../interfaces/_abstract_provider_service_.userinfoandtokens.md)<`UserInfo`>>

*Defined in [abstract-provider.service.ts:262](https://github.com/FoalTS/foal/blob/70cc46bd/packages/social/src/abstract-provider.service.ts#L262)*

Function to use in the controller method that handles the provider redirection.

It retrieves the access token as well as the user information.

*__template__*: UserInfo

*__memberof__*: AbstractProvider

**Type parameters:**

#### UserInfo 
**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| ctx | `Context` |  The request context. |
| `Optional` params | [UserInfoParameters]() |

**Returns:** `Promise`<[UserInfoAndTokens](../interfaces/_abstract_provider_service_.userinfoandtokens.md)<`UserInfo`>>
The access token and the user information

___
<a id="getuserinfofromtokens"></a>

### `<Abstract>` getUserInfoFromTokens

▸ **getUserInfoFromTokens**(tokens: *[SocialTokens](../interfaces/_abstract_provider_service_.socialtokens.md)*, params?: *[UserInfoParameters]()*): `any`

*Defined in [abstract-provider.service.ts:165](https://github.com/FoalTS/foal/blob/70cc46bd/packages/social/src/abstract-provider.service.ts#L165)*

Retrieve user information from the tokens returned by the authorization server.

This method may be synchronous or asynchronous.

*__abstract__*: 

*__memberof__*: AbstractProvider

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| tokens | [SocialTokens](../interfaces/_abstract_provider_service_.socialtokens.md) |  Tokens returned by the authorization server. It contains at least an access token. |
| `Optional` params | [UserInfoParameters]() |

**Returns:** `any`
The user information.

___
<a id="redirect"></a>

###  redirect

▸ **redirect**(__namedParameters?: *`object`*, params?: *[AuthParameters]()*): `Promise`<`HttpResponseRedirect`>

*Defined in [abstract-provider.service.ts:175](https://github.com/FoalTS/foal/blob/70cc46bd/packages/social/src/abstract-provider.service.ts#L175)*

Returns an HttpResponseRedirect object to use to redirect the user to the social provider's authorization page.

*__memberof__*: AbstractProvider

**Parameters:**

**`Default value` __namedParameters: `object`**

| Name | Type |
| ------ | ------ |
| scopes | `undefined` \| `string`[] |

**`Optional` params: [AuthParameters]()**

**Returns:** `Promise`<`HttpResponseRedirect`>
The HttpResponseRedirect object.

___

