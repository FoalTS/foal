[@foal/graphql](../README.md) > ["mask-and-log-error"](../modules/_mask_and_log_error_.md)

# External module: "mask-and-log-error"

## Index

### Functions

* [maskAndLogError](_mask_and_log_error_.md#maskandlogerror)

---

## Functions

<a id="maskandlogerror"></a>

###  maskAndLogError

▸ **maskAndLogError**(err: *`any`*): `any`

*Defined in [mask-and-log-error.ts:13](https://github.com/FoalTS/foal/blob/07f00115/packages/graphql/src/mask-and-log-error.ts#L13)*

Log errors and mask them if the configuration key "settings.debug" is not true.

If "settings.debug" is true, then the error is returned. If it is not, then an error whose message is "Internal Server Error" is returned.

*__export__*: 

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| err | `any` |  The error thrown or rejected in the resolver. |

**Returns:** `any`
The error to return to the client.

___

