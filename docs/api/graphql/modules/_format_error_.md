[@foal/graphql](../README.md) > ["format-error"](../modules/_format_error_.md)

# External module: "format-error"

## Index

### Functions

* [formatError](_format_error_.md#formaterror)

---

## Functions

<a id="formaterror"></a>

###  formatError

▸ **formatError**<`R`>(resolver: *`function`*, formatFunction?: *`function`*): `function`

*Defined in [format-error.ts:15](https://github.com/FoalTS/foal/blob/aac11366/packages/graphql/src/format-error.ts#L15)*

Catch errors rejected and thrown to reject a new one.

`formatError` creates a new function by wrapping the given one.

*__export__*: 

*__template__*: R

**Type parameters:**

#### R 
**Parameters:**

| Name | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| resolver | `function` | - |  The resolver function that throws or rejects the error. |
| `Default value` formatFunction | `function` |  maskAndLogError |

**Returns:** `function`
- The new function.

___

