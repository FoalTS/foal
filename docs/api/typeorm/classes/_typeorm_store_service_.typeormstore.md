[@foal/typeorm](../README.md) > ["typeorm-store.service"](../modules/_typeorm_store_service_.md) > [TypeORMStore](../classes/_typeorm_store_service_.typeormstore.md)

# Class: TypeORMStore

TypeORM store.

*__export__*: 

*__class__*: TypeORMStore

*__extends__*: {SessionStore}

## Hierarchy

 `SessionStore`

**↳ TypeORMStore**

## Index

### Properties

* [config](_typeorm_store_service_.typeormstore.md#config)
* [tableCreated](_typeorm_store_service_.typeormstore.md#tablecreated)

### Methods

* [applySessionOptions](_typeorm_store_service_.typeormstore.md#applysessionoptions)
* [cleanUpExpiredSessions](_typeorm_store_service_.typeormstore.md#cleanupexpiredsessions)
* [clear](_typeorm_store_service_.typeormstore.md#clear)
* [createAndSaveSession](_typeorm_store_service_.typeormstore.md#createandsavesession)
* [createAndSaveSessionFromUser](_typeorm_store_service_.typeormstore.md#createandsavesessionfromuser)
* [destroy](_typeorm_store_service_.typeormstore.md#destroy)
* [execQuery](_typeorm_store_service_.typeormstore.md#execquery)
* [extendLifeTime](_typeorm_store_service_.typeormstore.md#extendlifetime)
* [generateSessionID](_typeorm_store_service_.typeormstore.md#generatesessionid)
* [getConnection](_typeorm_store_service_.typeormstore.md#getconnection)
* [read](_typeorm_store_service_.typeormstore.md#read)
* [update](_typeorm_store_service_.typeormstore.md#update)
* [getExpirationTimeouts](_typeorm_store_service_.typeormstore.md#getexpirationtimeouts)

---

## Properties

<a id="config"></a>

###  config

**● config**: *`Config`*

*Defined in [typeorm-store.service.ts:20](https://github.com/FoalTS/foal/blob/70cc46bd/packages/typeorm/src/typeorm-store.service.ts#L20)*

___
<a id="tablecreated"></a>

### `<Private>` tableCreated

**● tableCreated**: *`boolean`* = false

*Defined in [typeorm-store.service.ts:22](https://github.com/FoalTS/foal/blob/70cc46bd/packages/typeorm/src/typeorm-store.service.ts#L22)*

___

## Methods

<a id="applysessionoptions"></a>

### `<Protected>` applySessionOptions

▸ **applySessionOptions**(content: *`object`*, options: *`SessionOptions`*): `Promise`<`void`>

*Inherited from SessionStore.applySessionOptions*

*Defined in /Users/loicpoullain/projects/FoalTS/foal/packages/typeorm/node_modules/@foal/core/lib/sessions/session-store.d.ts:145*

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

*Defined in [typeorm-store.service.ts:104](https://github.com/FoalTS/foal/blob/70cc46bd/packages/typeorm/src/typeorm-store.service.ts#L104)*

**Returns:** `Promise`<`void`>

___
<a id="clear"></a>

###  clear

▸ **clear**(): `Promise`<`void`>

*Overrides SessionStore.clear*

*Defined in [typeorm-store.service.ts:100](https://github.com/FoalTS/foal/blob/70cc46bd/packages/typeorm/src/typeorm-store.service.ts#L100)*

**Returns:** `Promise`<`void`>

___
<a id="createandsavesession"></a>

###  createAndSaveSession

▸ **createAndSaveSession**(sessionContent: *`object`*, options?: *`SessionOptions`*): `Promise`<`Session`>

*Overrides SessionStore.createAndSaveSession*

*Defined in [typeorm-store.service.ts:24](https://github.com/FoalTS/foal/blob/70cc46bd/packages/typeorm/src/typeorm-store.service.ts#L24)*

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

*Defined in /Users/loicpoullain/projects/FoalTS/foal/packages/typeorm/node_modules/@foal/core/lib/sessions/session-store.d.ts:49*

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

*Defined in [typeorm-store.service.ts:57](https://github.com/FoalTS/foal/blob/70cc46bd/packages/typeorm/src/typeorm-store.service.ts#L57)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| sessionID | `string` |

**Returns:** `Promise`<`void`>

___
<a id="execquery"></a>

### `<Private>` execQuery

▸ **execQuery**(query: *`string`*, parameters: *`ObjectLiteral`*): `Promise`<`any`>

*Defined in [typeorm-store.service.ts:116](https://github.com/FoalTS/foal/blob/70cc46bd/packages/typeorm/src/typeorm-store.service.ts#L116)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| query | `string` |
| parameters | `ObjectLiteral` |

**Returns:** `Promise`<`any`>

___
<a id="extendlifetime"></a>

###  extendLifeTime

▸ **extendLifeTime**(sessionID: *`string`*): `Promise`<`void`>

*Overrides SessionStore.extendLifeTime*

*Defined in [typeorm-store.service.ts:93](https://github.com/FoalTS/foal/blob/70cc46bd/packages/typeorm/src/typeorm-store.service.ts#L93)*

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

*Defined in /Users/loicpoullain/projects/FoalTS/foal/packages/typeorm/node_modules/@foal/core/lib/sessions/session-store.d.ts:134*

Generate a 128-bit base64url-encoded session ID.

*__memberof__*: SessionStore

**Returns:** `Promise`<`string`>
*   The session ID.

___
<a id="getconnection"></a>

### `<Private>` getConnection

▸ **getConnection**(): `Promise`<`Connection`>

*Defined in [typeorm-store.service.ts:124](https://github.com/FoalTS/foal/blob/70cc46bd/packages/typeorm/src/typeorm-store.service.ts#L124)*

**Returns:** `Promise`<`Connection`>

___
<a id="read"></a>

###  read

▸ **read**(sessionID: *`string`*): `Promise`<`Session` \| `undefined`>

*Overrides SessionStore.read*

*Defined in [typeorm-store.service.ts:64](https://github.com/FoalTS/foal/blob/70cc46bd/packages/typeorm/src/typeorm-store.service.ts#L64)*

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

*Defined in [typeorm-store.service.ts:43](https://github.com/FoalTS/foal/blob/70cc46bd/packages/typeorm/src/typeorm-store.service.ts#L43)*

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

*Defined in /Users/loicpoullain/projects/FoalTS/foal/packages/typeorm/node_modules/@foal/core/lib/sessions/session-store.d.ts:36*

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

