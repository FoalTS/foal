[@foal/mongoose](../README.md) > ["utils/fetch-user.util"](../modules/_utils_fetch_user_util_.md)

# External module: "utils/fetch-user.util"

## Index

### Functions

* [fetchUser](_utils_fetch_user_util_.md#fetchuser)

---

## Functions

<a id="fetchuser"></a>

###  fetchUser

▸ **fetchUser**(userModel: *`Model`<`any`>*): `function`

*Defined in [utils/fetch-user.util.ts:19](https://github.com/FoalTS/foal/blob/7934e4d7/packages/mongoose/src/utils/fetch-user.util.ts#L19)*

Create a function that finds the first document that matches some id.

It returns undefined if no document can be found.

This function is usually used by:

*   LoginRequired (@foal/core)
*   LoginOptional (@foal/core)
*   JWTRequired (@foal/jwt)
*   JWTOptional (@foal/jwt)

*__export__*: 

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| userModel | `Model`<`any`> |  The Mongoose Model |

**Returns:** `function`
The returned function expecting an id.

___

