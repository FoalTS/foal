[@foal/graphql](../README.md) > ["format-error.decorator"](../modules/_format_error_decorator_.md)

# External module: "format-error.decorator"

## Index

### Functions

* [FormatError](_format_error_decorator_.md#formaterror)

---

## Functions

<a id="formaterror"></a>

###  FormatError

▸ **FormatError**(formatFunction?: *`function`*): `function`

*Defined in [format-error.decorator.ts:13](https://github.com/FoalTS/foal/blob/07f00115/packages/graphql/src/format-error.decorator.ts#L13)*

Catch errors rejected and thrown to reject a new one.

`FormatError` is a method decorator that replaces the method with a new function wrapping it.

*__export__*: 

**Parameters:**

| Name | Type | Default value |
| ------ | ------ | ------ |
| `Default value` formatFunction | `function` |  maskAndLogError |

**Returns:** `function`

___

