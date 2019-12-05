[@foal/social](../README.md) > ["facebook-provider.service"](../modules/_facebook_provider_service_.md) > [FacebookProvider](../classes/_facebook_provider_service_.facebookprovider.md)

# Class: FacebookProvider

Facebook social provider.

*__export__*: 

*__class__*: FacebookProvider

*__extends__*: {AbstractProvider<FacebookAuthParams, FacebookUserInfoParams>}

## Hierarchy

 [AbstractProvider](_abstract_provider_service_.abstractprovider.md)<[FacebookAuthParams](../interfaces/_facebook_provider_service_.facebookauthparams.md), [FacebookUserInfoParams](../interfaces/_facebook_provider_service_.facebookuserinfoparams.md)>

**↳ FacebookProvider**

## Index

### Properties

* [authEndpoint](_facebook_provider_service_.facebookprovider.md#authendpoint)
* [configInstance](_facebook_provider_service_.facebookprovider.md#configinstance)
* [defaultScopes](_facebook_provider_service_.facebookprovider.md#defaultscopes)
* [fields](_facebook_provider_service_.facebookprovider.md#fields)
* [scopeSeparator](_facebook_provider_service_.facebookprovider.md#scopeseparator)
* [tokenEndpoint](_facebook_provider_service_.facebookprovider.md#tokenendpoint)
* [userInfoEndpoint](_facebook_provider_service_.facebookprovider.md#userinfoendpoint)

### Methods

* [getTokens](_facebook_provider_service_.facebookprovider.md#gettokens)
* [getUserInfo](_facebook_provider_service_.facebookprovider.md#getuserinfo)
* [getUserInfoFromTokens](_facebook_provider_service_.facebookprovider.md#getuserinfofromtokens)
* [redirect](_facebook_provider_service_.facebookprovider.md#redirect)

### Object literals

* [configPaths](_facebook_provider_service_.facebookprovider.md#configpaths)

---

## Properties

<a id="authendpoint"></a>

### `<Protected>` authEndpoint

**● authEndpoint**: *`string`* = "https://www.facebook.com/v5.0/dialog/oauth"

*Overrides [AbstractProvider](_abstract_provider_service_.abstractprovider.md).[authEndpoint](_abstract_provider_service_.abstractprovider.md#authendpoint)*

*Defined in [facebook-provider.service.ts:43](https://github.com/FoalTS/foal/blob/145b6b04/packages/social/src/facebook-provider.service.ts#L43)*

___
<a id="configinstance"></a>

###  configInstance

**● configInstance**: *`Config`*

*Inherited from [AbstractProvider](_abstract_provider_service_.abstractprovider.md).[configInstance](_abstract_provider_service_.abstractprovider.md#configinstance)*

*Defined in [abstract-provider.service.ts:106](https://github.com/FoalTS/foal/blob/145b6b04/packages/social/src/abstract-provider.service.ts#L106)*

___
<a id="defaultscopes"></a>

### `<Protected>` defaultScopes

**● defaultScopes**: *`string`[]* =  [ 'email' ]

*Overrides [AbstractProvider](_abstract_provider_service_.abstractprovider.md).[defaultScopes](_abstract_provider_service_.abstractprovider.md#defaultscopes)*

*Defined in [facebook-provider.service.ts:49](https://github.com/FoalTS/foal/blob/145b6b04/packages/social/src/facebook-provider.service.ts#L49)*

___
<a id="fields"></a>

### `<Protected>` fields

**● fields**: *`string`[]* =  [ 'id', 'name', 'email' ]

*Defined in [facebook-provider.service.ts:47](https://github.com/FoalTS/foal/blob/145b6b04/packages/social/src/facebook-provider.service.ts#L47)*

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

**● tokenEndpoint**: *`string`* = "https://graph.facebook.com/v5.0/oauth/access_token"

*Overrides [AbstractProvider](_abstract_provider_service_.abstractprovider.md).[tokenEndpoint](_abstract_provider_service_.abstractprovider.md#tokenendpoint)*

*Defined in [facebook-provider.service.ts:44](https://github.com/FoalTS/foal/blob/145b6b04/packages/social/src/facebook-provider.service.ts#L44)*

___
<a id="userinfoendpoint"></a>

### `<Protected>` userInfoEndpoint

**● userInfoEndpoint**: *`string`* = "https://graph.facebook.com/v5.0/me"

*Defined in [facebook-provider.service.ts:45](https://github.com/FoalTS/foal/blob/145b6b04/packages/social/src/facebook-provider.service.ts#L45)*

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

▸ **getUserInfoFromTokens**(tokens: *[SocialTokens](../interfaces/_abstract_provider_service_.socialtokens.md)*, params?: *[FacebookUserInfoParams](../interfaces/_facebook_provider_service_.facebookuserinfoparams.md)*): `Promise`<`any`>

*Overrides [AbstractProvider](_abstract_provider_service_.abstractprovider.md).[getUserInfoFromTokens](_abstract_provider_service_.abstractprovider.md#getuserinfofromtokens)*

*Defined in [facebook-provider.service.ts:51](https://github.com/FoalTS/foal/blob/145b6b04/packages/social/src/facebook-provider.service.ts#L51)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| tokens | [SocialTokens](../interfaces/_abstract_provider_service_.socialtokens.md) |
| `Optional` params | [FacebookUserInfoParams](../interfaces/_facebook_provider_service_.facebookuserinfoparams.md) |

**Returns:** `Promise`<`any`>

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

*Defined in [facebook-provider.service.ts:37](https://github.com/FoalTS/foal/blob/145b6b04/packages/social/src/facebook-provider.service.ts#L37)*

<a id="configpaths.clientid"></a>

####  clientId

**● clientId**: *`string`* = "settings.social.facebook.clientId"

*Defined in [facebook-provider.service.ts:38](https://github.com/FoalTS/foal/blob/145b6b04/packages/social/src/facebook-provider.service.ts#L38)*

___
<a id="configpaths.clientsecret"></a>

####  clientSecret

**● clientSecret**: *`string`* = "settings.social.facebook.clientSecret"

*Defined in [facebook-provider.service.ts:39](https://github.com/FoalTS/foal/blob/145b6b04/packages/social/src/facebook-provider.service.ts#L39)*

___
<a id="configpaths.redirecturi"></a>

####  redirectUri

**● redirectUri**: *`string`* = "settings.social.facebook.redirectUri"

*Defined in [facebook-provider.service.ts:40](https://github.com/FoalTS/foal/blob/145b6b04/packages/social/src/facebook-provider.service.ts#L40)*

___

___

