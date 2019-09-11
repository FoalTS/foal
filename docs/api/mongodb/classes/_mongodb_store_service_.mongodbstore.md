[@foal/mongodb](../README.md) > ["mongodb-store.service"](../modules/_mongodb_store_service_.md) > [MongoDBStore](../classes/_mongodb_store_service_.mongodbstore.md)

# Class: MongoDBStore

MongoDB store.

*__export__*: 

*__class__*: MongoDBStore

*__extends__*: {SessionStore}

## Hierarchy

 `SessionStore`

**↳ MongoDBStore**

## Index

### Properties

* [config](_mongodb_store_service_.mongodbstore.md#config)
* [mongoDBClient](_mongodb_store_service_.mongodbstore.md#mongodbclient)

### Methods

* [applySessionOptions](_mongodb_store_service_.mongodbstore.md#applysessionoptions)
* [cleanUpExpiredSessions](_mongodb_store_service_.mongodbstore.md#cleanupexpiredsessions)
* [clear](_mongodb_store_service_.mongodbstore.md#clear)
* [createAndSaveSession](_mongodb_store_service_.mongodbstore.md#createandsavesession)
* [createAndSaveSessionFromUser](_mongodb_store_service_.mongodbstore.md#createandsavesessionfromuser)
* [destroy](_mongodb_store_service_.mongodbstore.md#destroy)
* [extendLifeTime](_mongodb_store_service_.mongodbstore.md#extendlifetime)
* [generateSessionID](_mongodb_store_service_.mongodbstore.md#generatesessionid)
* [getMongoDBInstance](_mongodb_store_service_.mongodbstore.md#getmongodbinstance)
* [getSessionCollection](_mongodb_store_service_.mongodbstore.md#getsessioncollection)
* [read](_mongodb_store_service_.mongodbstore.md#read)
* [update](_mongodb_store_service_.mongodbstore.md#update)
* [getExpirationTimeouts](_mongodb_store_service_.mongodbstore.md#getexpirationtimeouts)

---

## Properties

<a id="config"></a>

###  config

**● config**: *`Config`*

*Defined in [mongodb-store.service.ts:20](https://github.com/FoalTS/foal/blob/aac11366/packages/mongodb/src/mongodb-store.service.ts#L20)*

___
<a id="mongodbclient"></a>

### `<Private>` mongoDBClient

**● mongoDBClient**: *`MongoClient`*

*Defined in [mongodb-store.service.ts:22](https://github.com/FoalTS/foal/blob/aac11366/packages/mongodb/src/mongodb-store.service.ts#L22)*

___

## Methods

<a id="applysessionoptions"></a>

### `<Protected>` applySessionOptions

▸ **applySessionOptions**(content: *`object`*, options: *`SessionOptions`*): `Promise`<`void`>

*Inherited from SessionStore.applySessionOptions*

*Defined in /Users/loicpoullain/projects/FoalTS/foal/packages/mongodb/node_modules/@foal/core/lib/sessions/session-store.d.ts:145*

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

*Defined in [mongodb-store.service.ts:95](https://github.com/FoalTS/foal/blob/aac11366/packages/mongodb/src/mongodb-store.service.ts#L95)*

**Returns:** `Promise`<`void`>

___
<a id="clear"></a>

###  clear

▸ **clear**(): `Promise`<`void`>

*Overrides SessionStore.clear*

*Defined in [mongodb-store.service.ts:91](https://github.com/FoalTS/foal/blob/aac11366/packages/mongodb/src/mongodb-store.service.ts#L91)*

**Returns:** `Promise`<`void`>

___
<a id="createandsavesession"></a>

###  createAndSaveSession

▸ **createAndSaveSession**(sessionContent: *`object`*, options?: *`SessionOptions`*): `Promise`<`Session`>

*Overrides SessionStore.createAndSaveSession*

*Defined in [mongodb-store.service.ts:24](https://github.com/FoalTS/foal/blob/aac11366/packages/mongodb/src/mongodb-store.service.ts#L24)*

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

*Defined in /Users/loicpoullain/projects/FoalTS/foal/packages/mongodb/node_modules/@foal/core/lib/sessions/session-store.d.ts:49*

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

*Defined in [mongodb-store.service.ts:54](https://github.com/FoalTS/foal/blob/aac11366/packages/mongodb/src/mongodb-store.service.ts#L54)*

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

*Defined in [mongodb-store.service.ts:80](https://github.com/FoalTS/foal/blob/aac11366/packages/mongodb/src/mongodb-store.service.ts#L80)*

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

*Defined in /Users/loicpoullain/projects/FoalTS/foal/packages/mongodb/node_modules/@foal/core/lib/sessions/session-store.d.ts:134*

Generate a 128-bit base64url-encoded session ID.

*__memberof__*: SessionStore

**Returns:** `Promise`<`string`>
*   The session ID.

___
<a id="getmongodbinstance"></a>

###  getMongoDBInstance

▸ **getMongoDBInstance**(): `Promise`<`MongoClient`>

*Defined in [mongodb-store.service.ts:105](https://github.com/FoalTS/foal/blob/aac11366/packages/mongodb/src/mongodb-store.service.ts#L105)*

**Returns:** `Promise`<`MongoClient`>

___
<a id="getsessioncollection"></a>

### `<Private>` getSessionCollection

▸ **getSessionCollection**(): `Promise`<`Collection`>

*Defined in [mongodb-store.service.ts:113](https://github.com/FoalTS/foal/blob/aac11366/packages/mongodb/src/mongodb-store.service.ts#L113)*

**Returns:** `Promise`<`Collection`>

___
<a id="read"></a>

###  read

▸ **read**(sessionID: *`string`*): `Promise`<`Session` \| `undefined`>

*Overrides SessionStore.read*

*Defined in [mongodb-store.service.ts:58](https://github.com/FoalTS/foal/blob/aac11366/packages/mongodb/src/mongodb-store.service.ts#L58)*

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

*Defined in [mongodb-store.service.ts:39](https://github.com/FoalTS/foal/blob/aac11366/packages/mongodb/src/mongodb-store.service.ts#L39)*

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

*Defined in /Users/loicpoullain/projects/FoalTS/foal/packages/mongodb/node_modules/@foal/core/lib/sessions/session-store.d.ts:36*

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

