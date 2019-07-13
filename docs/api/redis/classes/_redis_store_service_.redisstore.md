[@foal/redis](../README.md) > ["redis-store.service"](../modules/_redis_store_service_.md) > [RedisStore](../classes/_redis_store_service_.redisstore.md)

# Class: RedisStore

Redis Store

*__export__*: 

*__class__*: RedisStore

*__extends__*: {SessionStore}

## Hierarchy

 `SessionStore`

**↳ RedisStore**

## Index

### Properties

* [config](_redis_store_service_.redisstore.md#config)
* [redisClient](_redis_store_service_.redisstore.md#redisclient)

### Methods

* [applySessionOptions](_redis_store_service_.redisstore.md#applysessionoptions)
* [cleanUpExpiredSessions](_redis_store_service_.redisstore.md#cleanupexpiredsessions)
* [clear](_redis_store_service_.redisstore.md#clear)
* [createAndSaveSession](_redis_store_service_.redisstore.md#createandsavesession)
* [createAndSaveSessionFromUser](_redis_store_service_.redisstore.md#createandsavesessionfromuser)
* [destroy](_redis_store_service_.redisstore.md#destroy)
* [extendLifeTime](_redis_store_service_.redisstore.md#extendlifetime)
* [generateSessionID](_redis_store_service_.redisstore.md#generatesessionid)
* [getRedisInstance](_redis_store_service_.redisstore.md#getredisinstance)
* [read](_redis_store_service_.redisstore.md#read)
* [update](_redis_store_service_.redisstore.md#update)
* [getExpirationTimeouts](_redis_store_service_.redisstore.md#getexpirationtimeouts)

---

## Properties

<a id="config"></a>

###  config

**● config**: *`Config`*

*Defined in [redis-store.service.ts:14](https://github.com/FoalTS/foal/blob/07f00115/packages/redis/src/redis-store.service.ts#L14)*

___
<a id="redisclient"></a>

### `<Private>` redisClient

**● redisClient**: *`any`*

*Defined in [redis-store.service.ts:16](https://github.com/FoalTS/foal/blob/07f00115/packages/redis/src/redis-store.service.ts#L16)*

___

## Methods

<a id="applysessionoptions"></a>

### `<Protected>` applySessionOptions

▸ **applySessionOptions**(content: *`object`*, options: *`SessionOptions`*): `Promise`<`void`>

*Inherited from SessionStore.applySessionOptions*

*Defined in /Users/loicpoullain/projects/FoalTS/foal/packages/redis/node_modules/@foal/core/lib/sessions/session-store.d.ts:145*

Apply session options to the given session content.

*__memberof__*: SessionStore

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| content | `object` |  Session content. |
| options | `SessionOptions` |  Session options. |

**Returns:** `Promise`<`void`>

___
<a id="cleanupexpiredsessions"></a>

###  cleanUpExpiredSessions

▸ **cleanUpExpiredSessions**(): `Promise`<`void`>

*Overrides SessionStore.cleanUpExpiredSessions*

*Defined in [redis-store.service.ts:110](https://github.com/FoalTS/foal/blob/07f00115/packages/redis/src/redis-store.service.ts#L110)*

**Returns:** `Promise`<`void`>

___
<a id="clear"></a>

###  clear

▸ **clear**(): `Promise`<`void`>

*Overrides SessionStore.clear*

*Defined in [redis-store.service.ts:99](https://github.com/FoalTS/foal/blob/07f00115/packages/redis/src/redis-store.service.ts#L99)*

**Returns:** `Promise`<`void`>

___
<a id="createandsavesession"></a>

###  createAndSaveSession

▸ **createAndSaveSession**(sessionContent: *`object`*, options?: *`SessionOptions`*): `Promise`<`Session`>

*Overrides SessionStore.createAndSaveSession*

*Defined in [redis-store.service.ts:18](https://github.com/FoalTS/foal/blob/07f00115/packages/redis/src/redis-store.service.ts#L18)*

**Parameters:**

| Name | Type | Default value |
| ------ | ------ | ------ |
| sessionContent | `object` | - |
| `Default value` options | `SessionOptions` |  {} |

**Returns:** `Promise`<`Session`>

___
<a id="createandsavesessionfromuser"></a>

###  createAndSaveSessionFromUser

▸ **createAndSaveSessionFromUser**(user: *`object`*, options?: *`SessionOptions`*): `Promise`<`Session`>

*Inherited from SessionStore.createAndSaveSessionFromUser*

*Defined in /Users/loicpoullain/projects/FoalTS/foal/packages/redis/node_modules/@foal/core/lib/sessions/session-store.d.ts:49*

Create and save an new session from a user.

*__memberof__*: SessionStore

**Parameters:**

**user: `object`**

| Name | Type |
| ------ | ------ |
| id | `string` \| `number` |

**`Optional` options: `SessionOptions`**

Session options.

**Returns:** `Promise`<`Session`>
The created session.

___
<a id="destroy"></a>

###  destroy

▸ **destroy**(sessionID: *`string`*): `Promise`<`void`>

*Overrides SessionStore.destroy*

*Defined in [redis-store.service.ts:51](https://github.com/FoalTS/foal/blob/07f00115/packages/redis/src/redis-store.service.ts#L51)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| sessionID | `string` |

**Returns:** `Promise`<`void`>

___
<a id="extendlifetime"></a>

###  extendLifeTime

▸ **extendLifeTime**(sessionID: *`string`*): `Promise`<`void`>

*Overrides SessionStore.extendLifeTime*

*Defined in [redis-store.service.ts:86](https://github.com/FoalTS/foal/blob/07f00115/packages/redis/src/redis-store.service.ts#L86)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| sessionID | `string` |

**Returns:** `Promise`<`void`>

___
<a id="generatesessionid"></a>

### `<Protected>` generateSessionID

▸ **generateSessionID**(): `Promise`<`string`>

*Inherited from SessionStore.generateSessionID*

*Defined in /Users/loicpoullain/projects/FoalTS/foal/packages/redis/node_modules/@foal/core/lib/sessions/session-store.d.ts:134*

Generate a 128-bit base64url-encoded session ID.

*__memberof__*: SessionStore

**Returns:** `Promise`<`string`>
*   The session ID.

___
<a id="getredisinstance"></a>

###  getRedisInstance

▸ **getRedisInstance**(): `any`

*Defined in [redis-store.service.ts:112](https://github.com/FoalTS/foal/blob/07f00115/packages/redis/src/redis-store.service.ts#L112)*

**Returns:** `any`

___
<a id="read"></a>

###  read

▸ **read**(sessionID: *`string`*): `Promise`<`Session` \| `undefined`>

*Overrides SessionStore.read*

*Defined in [redis-store.service.ts:62](https://github.com/FoalTS/foal/blob/07f00115/packages/redis/src/redis-store.service.ts#L62)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| sessionID | `string` |

**Returns:** `Promise`<`Session` \| `undefined`>

___
<a id="update"></a>

###  update

▸ **update**(session: *`Session`*): `Promise`<`void`>

*Overrides SessionStore.update*

*Defined in [redis-store.service.ts:37](https://github.com/FoalTS/foal/blob/07f00115/packages/redis/src/redis-store.service.ts#L37)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| session | `Session` |

**Returns:** `Promise`<`void`>

___
<a id="getexpirationtimeouts"></a>

### `<Static>` getExpirationTimeouts

▸ **getExpirationTimeouts**(): `object`

*Inherited from SessionStore.getExpirationTimeouts*

*Defined in /Users/loicpoullain/projects/FoalTS/foal/packages/redis/node_modules/@foal/core/lib/sessions/session-store.d.ts:36*

Read session expiration timeouts from the configuration.

The values are in seconds.

Default values are:

*   15 min for inactivity timeout
*   1 week for absolute timeout

This method throws an error if one of the following is true:

*   The given inactivity timeout is negative.
*   The given absolute timeout is negative.
*   The given inactivity timeout is greater than the absolute timeout.

*__static__*: 

*__memberof__*: SessionStore

**Returns:** `object`
The expiration timeouts

___

