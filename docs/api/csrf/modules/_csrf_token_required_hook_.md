[@foal/csrf](../README.md) > ["csrf-token-required.hook"](../modules/_csrf_token_required_hook_.md)

# External module: "csrf-token-required.hook"

## Index

### Functions

* [CsrfTokenRequired](_csrf_token_required_hook_.md#csrftokenrequired)
* [getRequestToken](_csrf_token_required_hook_.md#getrequesttoken)

---

## Functions

<a id="csrftokenrequired"></a>

###  CsrfTokenRequired

▸ **CsrfTokenRequired**(options?: *`object`*): `HookDecorator`

*Defined in [csrf-token-required.hook.ts:15](https://github.com/FoalTS/foal/blob/aac11366/packages/csrf/src/csrf-token-required.hook.ts#L15)*

**Parameters:**

**`Default value` options: `object`**

| Name | Type |
| ------ | ------ |
| `Optional` doubleSubmitCookie | `undefined` \| `false` \| `true` |

**Returns:** `HookDecorator`

___
<a id="getrequesttoken"></a>

###  getRequestToken

▸ **getRequestToken**(req: *`Request`*): `string` \| `undefined`

*Defined in [csrf-token-required.hook.ts:6](https://github.com/FoalTS/foal/blob/aac11366/packages/csrf/src/csrf-token-required.hook.ts#L6)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| req | `Request` |

**Returns:** `string` \| `undefined`

___

