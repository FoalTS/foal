[@foal/typestack](../README.md) > ["validate-body.hook"](../modules/_validate_body_hook_.md)

# External module: "validate-body.hook"

## Index

### Interfaces

* [ValidateBodyOptions](../interfaces/_validate_body_hook_.validatebodyoptions.md)

### Functions

* [ValidateBody](_validate_body_hook_.md#validatebody)

---

## Functions

<a id="validatebody"></a>

###  ValidateBody

▸ **ValidateBody**(cls: *`Class`*, options?: *[ValidateBodyOptions](../interfaces/_validate_body_hook_.validatebodyoptions.md)*): `HookDecorator`

*Defined in [validate-body.hook.ts:20](https://github.com/FoalTS/foal/blob/70cc46bd/packages/typestack/src/validate-body.hook.ts#L20)*

Hook factory validating the request body against a validator class. It also transforms the request body into an instance of the class.

*__export__*: 

**Parameters:**

| Name | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| cls | `Class` | - |  The validator class (see \`class-validator\` and \`class-tranformer\` packages). |
| `Default value` options | [ValidateBodyOptions](../interfaces/_validate_body_hook_.validatebodyoptions.md) |  {} |

**Returns:** `HookDecorator`
*   The hook.

___

