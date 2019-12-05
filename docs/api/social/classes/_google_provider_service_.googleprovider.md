[@foal/social](../README.md) > ["google-provider.service"](../modules/_google_provider_service_.md) > [GoogleProvider](../classes/_google_provider_service_.googleprovider.md)

# Class: GoogleProvider

Google social provider.

*__export__*: 

*__class__*: GoogleProvider

*__extends__*: {AbstractProvider<GoogleAuthParams, never>}

## Hierarchy

 [AbstractProvider](_abstract_provider_service_.abstractprovider.md)<[GoogleAuthParams](../interfaces/_google_provider_service_.googleauthparams.md), `never`>

**↳ GoogleProvider**

## Index

### Properties

* [authEndpoint](_google_provider_service_.googleprovider.md#authendpoint)
* [configInstance](_google_provider_service_.googleprovider.md#configinstance)
* [defaultScopes](_google_provider_service_.googleprovider.md#defaultscopes)
* [scopeSeparator](_google_provider_service_.googleprovider.md#scopeseparator)
* [tokenEndpoint](_google_provider_service_.googleprovider.md#tokenendpoint)

### Methods

* [getTokens](_google_provider_service_.googleprovider.md#gettokens)
* [getUserInfo](_google_provider_service_.googleprovider.md#getuserinfo)
* [getUserInfoFromTokens](_google_provider_service_.googleprovider.md#getuserinfofromtokens)
* [redirect](_google_provider_service_.googleprovider.md#redirect)

### Object literals

* [configPaths](_google_provider_service_.googleprovider.md#configpaths)

---

## Properties

<a id="authendpoint"></a>

### `<Protected>` authEndpoint

**● authEndpoint**: *`string`* = "https://accounts.google.com/o/oauth2/v2/auth"

*Overrides [AbstractProvider](_abstract_provider_service_.abstractprovider.md).[authEndpoint](_abstract_provider_service_.abstractprovider.md#authendpoint)*

*Defined in [google-provider.service.ts:32](https://github.com/FoalTS/foal/blob/145b6b04/packages/social/src/google-provider.service.ts#L32)*

___
<a id="configinstance"></a>

###  configInstance

**● configInstance**: *`Config`*

*Inherited from [AbstractProvider](_abstract_provider_service_.abstractprovider.md).[configInstance](_abstract_provider_service_.abstractprovider.md#configinstance)*

*Defined in [abstract-provider.service.ts:106](https://github.com/FoalTS/foal/blob/145b6b04/packages/social/src/abstract-provider.service.ts#L106)*

___
<a id="defaultscopes"></a>

### `<Protected>` defaultScopes

**● defaultScopes**: *`string`[]* =  [ 'openid', 'profile', 'email' ]

*Overrides [AbstractProvider](_abstract_provider_service_.abstractprovider.md).[defaultScopes](_abstract_provider_service_.abstractprovider.md#defaultscopes)*

*Defined in [google-provider.service.ts:35](https://github.com/FoalTS/foal/blob/145b6b04/packages/social/src/google-provider.service.ts#L35)*

___
<a id="scopeseparator"></a>

### `<Protected>` scopeSeparator

**● scopeSeparator**: *`string`* = " "

*Inherited from [AbstractProvider](_abstract_provider_service_.abstractprovider.md).[scopeSeparator](_abstract_provider_service_.abstractprovider.md#scopeseparator)*

*Defined in [abstract-provider.service.ts:160](https://github.com/FoalTS/foal/blob/145b6b04/packages/social/src/abstract-provider.service.ts#L160)*

Character used to separate the scopes in the URL.

*__type__*: {string}

*__memberof__*: AbstractProvider

___
<a id="tokenendpoint"></a>

### `<Protected>` tokenEndpoint

**● tokenEndpoint**: *`string`* = "https://oauth2.googleapis.com/token"

*Overrides [AbstractProvider](_abstract_provider_service_.abstractprovider.md).[tokenEndpoint](_abstract_provider_service_.abstractprovider.md#tokenendpoint)*

*Defined in [google-provider.service.ts:33](https://github.com/FoalTS/foal/blob/145b6b04/packages/social/src/google-provider.service.ts#L33)*

___

## Methods

<a id="gettokens"></a>

###  getTokens

▸ **getTokens**(ctx: *`Context`*): `Promise`<[SocialTokens](../interfaces/_abstract_provider_service_.socialtokens.md)>

*Inherited from [AbstractProvider](_abstract_provider_service_.abstractprovider.md).[getTokens](_abstract_provider_service_.abstractprovider.md#gettokens)*

*Defined in [abstract-provider.service.ts:235](https://github.com/FoalTS/foal/blob/145b6b04/packages/social/src/abstract-provider.service.ts#L235)*

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

*Inherited from [AbstractProvider](_abstract_provider_service_.abstractprovider.md).[getUserInfo](_abstract_provider_service_.abstractprovider.md#getuserinfo)*

*Defined in [abstract-provider.service.ts:278](https://github.com/FoalTS/foal/blob/145b6b04/packages/social/src/abstract-provider.service.ts#L278)*

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

###  getUserInfoFromTokens

▸ **getUserInfoFromTokens**(tokens: *[SocialTokens](../interfaces/_abstract_provider_service_.socialtokens.md)*): `object`

*Overrides [AbstractProvider](_abstract_provider_service_.abstractprovider.md).[getUserInfoFromTokens](_abstract_provider_service_.abstractprovider.md#getuserinfofromtokens)*

*Defined in [google-provider.service.ts:37](https://github.com/FoalTS/foal/blob/145b6b04/packages/social/src/google-provider.service.ts#L37)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| tokens | [SocialTokens](../interfaces/_abstract_provider_service_.socialtokens.md) |

**Returns:** `object`

___
<a id="redirect"></a>

###  redirect

▸ **redirect**(__namedParameters?: *`object`*, params?: *[AuthParameters]()*): `Promise`<`HttpResponseRedirect`>

*Inherited from [AbstractProvider](_abstract_provider_service_.abstractprovider.md).[redirect](_abstract_provider_service_.abstractprovider.md#redirect)*

*Defined in [abstract-provider.service.ts:191](https://github.com/FoalTS/foal/blob/145b6b04/packages/social/src/abstract-provider.service.ts#L191)*

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

## Object literals

<a id="configpaths"></a>

### `<Protected>` configPaths

**configPaths**: *`object`*

*Overrides [AbstractProvider](_abstract_provider_service_.abstractprovider.md).[configPaths](_abstract_provider_service_.abstractprovider.md#configpaths)*

*Defined in [google-provider.service.ts:27](https://github.com/FoalTS/foal/blob/145b6b04/packages/social/src/google-provider.service.ts#L27)*

<a id="configpaths.clientid"></a>

####  clientId

**● clientId**: *`string`* = "settings.social.google.clientId"

*Defined in [google-provider.service.ts:28](https://github.com/FoalTS/foal/blob/145b6b04/packages/social/src/google-provider.service.ts#L28)*

___
<a id="configpaths.clientsecret"></a>

####  clientSecret

**● clientSecret**: *`string`* = "settings.social.google.clientSecret"

*Defined in [google-provider.service.ts:29](https://github.com/FoalTS/foal/blob/145b6b04/packages/social/src/google-provider.service.ts#L29)*

___
<a id="configpaths.redirecturi"></a>

####  redirectUri

**● redirectUri**: *`string`* = "settings.social.google.redirectUri"

*Defined in [google-provider.service.ts:30](https://github.com/FoalTS/foal/blob/145b6b04/packages/social/src/google-provider.service.ts#L30)*

___

___

