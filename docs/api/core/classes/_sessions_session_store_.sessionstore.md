[@foal/core](../README.md) > ["sessions/session-store"](../modules/_sessions_session_store_.md) > [SessionStore](../classes/_sessions_session_store_.sessionstore.md)

# Class: SessionStore

Abstract class to be override when creating a session storage service.

A session store peforms CRUD operations on sessions and can store them in a database, file system, memory, etc.

Examples of SessionStore: TypeORMStore, RedisStore, MongoDBStore.

*__export__*: 

*__abstract__*: 

*__class__*: SessionStore

## Hierarchy

**SessionStore**

## Index

### Methods

* [applySessionOptions](_sessions_session_store_.sessionstore.md#applysessionoptions)
* [cleanUpExpiredSessions](_sessions_session_store_.sessionstore.md#cleanupexpiredsessions)
* [clear](_sessions_session_store_.sessionstore.md#clear)
* [createAndSaveSession](_sessions_session_store_.sessionstore.md#createandsavesession)
* [createAndSaveSessionFromUser](_sessions_session_store_.sessionstore.md#createandsavesessionfromuser)
* [destroy](_sessions_session_store_.sessionstore.md#destroy)
* [extendLifeTime](_sessions_session_store_.sessionstore.md#extendlifetime)
* [generateSessionID](_sessions_session_store_.sessionstore.md#generatesessionid)
* [read](_sessions_session_store_.sessionstore.md#read)
* [update](_sessions_session_store_.sessionstore.md#update)
* [getExpirationTimeouts](_sessions_session_store_.sessionstore.md#getexpirationtimeouts)

---

## Methods

<a id="applysessionoptions"></a>

### `<Protected>` applySessionOptions

▸ **applySessionOptions**(content: *`object`*, options: *[SessionOptions](../interfaces/_sessions_session_store_.sessionoptions.md)*): `Promise`<`void`>

*Defined in [sessions/session-store.ts:174](https://github.com/FoalTS/foal/blob/70cc46bd/packages/core/src/sessions/session-store.ts#L174)*

Apply session options to the given session content.

*__memberof__*: SessionStore

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| content | `object` |  Session content. |
| options | [SessionOptions](../interfaces/_sessions_session_store_.sessionoptions.md) |  Session options. |

**Returns:** `Promise`<`void`>

___
<a id="cleanupexpiredsessions"></a>

### `<Abstract>` cleanUpExpiredSessions

▸ **cleanUpExpiredSessions**(): `Promise`<`void`>

*Defined in [sessions/session-store.ts:151](https://github.com/FoalTS/foal/blob/70cc46bd/packages/core/src/sessions/session-store.ts#L151)*

Some session stores may need to run periodically background jobs to cleanup expired sessions.

This method deletes all expired sessions.

*__abstract__*: 

*__memberof__*: SessionStore

**Returns:** `Promise`<`void`>

___
<a id="clear"></a>

### `<Abstract>` clear

▸ **clear**(): `Promise`<`void`>

*Defined in [sessions/session-store.ts:141](https://github.com/FoalTS/foal/blob/70cc46bd/packages/core/src/sessions/session-store.ts#L141)*

Clear all sessions.

*__abstract__*: 

*__memberof__*: SessionStore

**Returns:** `Promise`<`void`>

___
<a id="createandsavesession"></a>

### `<Abstract>` createAndSaveSession

▸ **createAndSaveSession**(sessionContent: *`object`*, options?: *[SessionOptions](../interfaces/_sessions_session_store_.sessionoptions.md)*): `Promise`<[Session](_sessions_session_.session.md)>

*Defined in [sessions/session-store.ts:90](https://github.com/FoalTS/foal/blob/70cc46bd/packages/core/src/sessions/session-store.ts#L90)*

Create and save a new session.

This method _MUST_ call the `generateSessionID` method to generate the session ID. This method _MUST_ call the `applySessionOptions` method to extend the sessionContent.

*__abstract__*: 

*__memberof__*: SessionStore

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| sessionContent | `object` |  The content of the session (often includes the user ID). |
| `Optional` options | [SessionOptions](../interfaces/_sessions_session_store_.sessionoptions.md) |  Session options. |

**Returns:** `Promise`<[Session](_sessions_session_.session.md)>
The created session.

___
<a id="createandsavesessionfromuser"></a>

###  createAndSaveSessionFromUser

▸ **createAndSaveSessionFromUser**(user: *`object`*, options?: *[SessionOptions](../interfaces/_sessions_session_store_.sessionoptions.md)*): `Promise`<[Session](_sessions_session_.session.md)>

*Defined in [sessions/session-store.ts:73](https://github.com/FoalTS/foal/blob/70cc46bd/packages/core/src/sessions/session-store.ts#L73)*

Create and save an new session from a user.

*__memberof__*: SessionStore

**Parameters:**

**user: `object`**

| Name | Type |
| ------ | ------ |
| id | `string` \| `number` |

**`Optional` options: [SessionOptions](../interfaces/_sessions_session_store_.sessionoptions.md)**

Session options.

**Returns:** `Promise`<[Session](_sessions_session_.session.md)>
The created session.

___
<a id="destroy"></a>

### `<Abstract>` destroy

▸ **destroy**(sessionID: *`string`*): `Promise`<`void`>

*Defined in [sessions/session-store.ts:110](https://github.com/FoalTS/foal/blob/70cc46bd/packages/core/src/sessions/session-store.ts#L110)*

Delete a session, whether it exists or not.

*__abstract__*: 

*__memberof__*: SessionStore

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| sessionID | `string` |  The ID of the session. |

**Returns:** `Promise`<`void`>

___
<a id="extendlifetime"></a>

### `<Abstract>` extendLifeTime

▸ **extendLifeTime**(sessionID: *`string`*): `Promise`<`void`>

*Defined in [sessions/session-store.ts:133](https://github.com/FoalTS/foal/blob/70cc46bd/packages/core/src/sessions/session-store.ts#L133)*

Extend the lifetime of a session from its ID. The duration is the inactivity timeout.

If the session does not exist, the method does not throw an error.

*__abstract__*: 

*__memberof__*: SessionStore

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| sessionID | `string` |  The ID of the session. |

**Returns:** `Promise`<`void`>

___
<a id="generatesessionid"></a>

### `<Protected>` generateSessionID

▸ **generateSessionID**(): `Promise`<`string`>

*Defined in [sessions/session-store.ts:160](https://github.com/FoalTS/foal/blob/70cc46bd/packages/core/src/sessions/session-store.ts#L160)*

Generate a 128-bit base64url-encoded session ID.

*__memberof__*: SessionStore

**Returns:** `Promise`<`string`>
*   The session ID.

___
<a id="read"></a>

### `<Abstract>` read

▸ **read**(sessionID: *`string`*): `Promise`<[Session](_sessions_session_.session.md) \| `undefined`>

*Defined in [sessions/session-store.ts:121](https://github.com/FoalTS/foal/blob/70cc46bd/packages/core/src/sessions/session-store.ts#L121)*

Read a session from its ID.

Returns `undefined` if the session does not exist or has expired.

*__abstract__*: 

*__memberof__*: SessionStore

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| sessionID | `string` |  The ID of the session. |

**Returns:** `Promise`<[Session](_sessions_session_.session.md) \| `undefined`>
The Session object.

___
<a id="update"></a>

### `<Abstract>` update

▸ **update**(session: *[Session](_sessions_session_.session.md)*): `Promise`<`void`>

*Defined in [sessions/session-store.ts:101](https://github.com/FoalTS/foal/blob/70cc46bd/packages/core/src/sessions/session-store.ts#L101)*

Update and extend the lifetime of a session.

Depending on the implementation, the internal behavior can be similar to "update" or "upsert".

*__abstract__*: 

*__memberof__*: SessionStore

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| session | [Session](_sessions_session_.session.md) |  The session containaing the updated content. |

**Returns:** `Promise`<`void`>

___
<a id="getexpirationtimeouts"></a>

### `<Static>` getExpirationTimeouts

▸ **getExpirationTimeouts**(): `object`

*Defined in [sessions/session-store.ts:43](https://github.com/FoalTS/foal/blob/70cc46bd/packages/core/src/sessions/session-store.ts#L43)*

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

