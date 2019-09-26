[@foal/core](../README.md) > ["sessions/session"](../modules/_sessions_session_.md) > [Session](../classes/_sessions_session_.session.md)

# Class: Session

Representation of a server/database session.

*__export__*: 

*__class__*: Session

## Hierarchy

**Session**

## Index

### Constructors

* [constructor](_sessions_session_.session.md#constructor)

### Properties

* [createdAt](_sessions_session_.session.md#createdat)
* [modified](_sessions_session_.session.md#modified)
* [sessionContent](_sessions_session_.session.md#sessioncontent)
* [sessionID](_sessions_session_.session.md#sessionid)

### Accessors

* [isModified](_sessions_session_.session.md#ismodified)

### Methods

* [get](_sessions_session_.session.md#get)
* [getContent](_sessions_session_.session.md#getcontent)
* [getToken](_sessions_session_.session.md#gettoken)
* [set](_sessions_session_.session.md#set)
* [verifyTokenAndGetId](_sessions_session_.session.md#verifytokenandgetid)

---

## Constructors

<a id="constructor"></a>

###  constructor

⊕ **new Session**(sessionID: *`string`*, sessionContent: *`object`*, createdAt: *`number`*): [Session](_sessions_session_.session.md)

*Defined in [sessions/session.ts:30](https://github.com/FoalTS/foal/blob/538afb23/packages/core/src/sessions/session.ts#L30)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| sessionID | `string` |
| sessionContent | `object` |
| createdAt | `number` |

**Returns:** [Session](_sessions_session_.session.md)

___

## Properties

<a id="createdat"></a>

###  createdAt

**● createdAt**: *`number`*

*Defined in [sessions/session.ts:32](https://github.com/FoalTS/foal/blob/538afb23/packages/core/src/sessions/session.ts#L32)*

___
<a id="modified"></a>

### `<Private>` modified

**● modified**: *`boolean`* = false

*Defined in [sessions/session.ts:30](https://github.com/FoalTS/foal/blob/538afb23/packages/core/src/sessions/session.ts#L30)*

___
<a id="sessioncontent"></a>

### `<Private>` sessionContent

**● sessionContent**: *`object`*

*Defined in [sessions/session.ts:32](https://github.com/FoalTS/foal/blob/538afb23/packages/core/src/sessions/session.ts#L32)*

___
<a id="sessionid"></a>

###  sessionID

**● sessionID**: *`string`*

*Defined in [sessions/session.ts:32](https://github.com/FoalTS/foal/blob/538afb23/packages/core/src/sessions/session.ts#L32)*

___

## Accessors

<a id="ismodified"></a>

###  isModified

**get isModified**(): `boolean`

*Defined in [sessions/session.ts:45](https://github.com/FoalTS/foal/blob/538afb23/packages/core/src/sessions/session.ts#L45)*

Return true if an element was added/replaces in the session

*__readonly__*: 

*__type__*: {boolean}

*__memberof__*: Session

**Returns:** `boolean`

___

## Methods

<a id="get"></a>

###  get

▸ **get**<`T`>(key: *`string`*): `T` \| `undefined`

▸ **get**<`T`>(key: *`string`*, defaultValue: *`any`*): `T`

*Defined in [sessions/session.ts:70](https://github.com/FoalTS/foal/blob/538afb23/packages/core/src/sessions/session.ts#L70)*

The value of an element in the session content.

*__template__*: T

*__memberof__*: Session

**Type parameters:**

#### T 
**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| key | `string` |  The property key |

**Returns:** `T` \| `undefined`
The property valye

*Defined in [sessions/session.ts:71](https://github.com/FoalTS/foal/blob/538afb23/packages/core/src/sessions/session.ts#L71)*

**Type parameters:**

#### T 
**Parameters:**

| Name | Type |
| ------ | ------ |
| key | `string` |
| defaultValue | `any` |

**Returns:** `T`

___
<a id="getcontent"></a>

###  getContent

▸ **getContent**(): `object`

*Defined in [sessions/session.ts:100](https://github.com/FoalTS/foal/blob/538afb23/packages/core/src/sessions/session.ts#L100)*

Get a copy of the session content.

*__memberof__*: Session

**Returns:** `object`
*   The session content copy.

___
<a id="gettoken"></a>

###  getToken

▸ **getToken**(): `string`

*Defined in [sessions/session.ts:86](https://github.com/FoalTS/foal/blob/538afb23/packages/core/src/sessions/session.ts#L86)*

Get the session token. This token is used by `@TokenRequired` and `@TokenOptional` to retreive the session and the authenticated user if she/he exists.

*__memberof__*: Session

**Returns:** `string`
*   The session token.

___
<a id="set"></a>

###  set

▸ **set**(key: *`string`*, value: *`any`*): `void`

*Defined in [sessions/session.ts:57](https://github.com/FoalTS/foal/blob/538afb23/packages/core/src/sessions/session.ts#L57)*

Add/replace an element in the session. This operation is not saved in the saved unless you call SessionStore.update(session).

*__memberof__*: Session

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| key | `string` |  \- |
| value | `any` |  \- |

**Returns:** `void`

___
<a id="verifytokenandgetid"></a>

### `<Static>` verifyTokenAndGetId

▸ **verifyTokenAndGetId**(token: *`string`*): `string` \| `false`

*Defined in [sessions/session.ts:21](https://github.com/FoalTS/foal/blob/538afb23/packages/core/src/sessions/session.ts#L21)*

Verify a session token and return the sessionID if the token is valid.

*__static__*: 

*__memberof__*: Session

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| token | `string` |  The session token to verify. |

**Returns:** `string` \| `false`
False if the token is invalid. Otherwise, the returned value is the session ID.

___

