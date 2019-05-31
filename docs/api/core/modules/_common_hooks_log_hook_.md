[@foal/core](../README.md) > ["common/hooks/log.hook"](../modules/_common_hooks_log_hook_.md)

# External module: "common/hooks/log.hook"

## Index

### Interfaces

* [LogOptions](../interfaces/_common_hooks_log_hook_.logoptions.md)

### Functions

* [Log](_common_hooks_log_hook_.md#log)

---

## Functions

<a id="log"></a>

###  Log

▸ **Log**(message: *`string`*, options?: *[LogOptions](../interfaces/_common_hooks_log_hook_.logoptions.md)*): [HookDecorator](_core_hooks_.md#hookdecorator)

*Defined in [common/hooks/log.hook.ts:32](https://github.com/FoalTS/foal/blob/cf326d07/packages/core/src/common/hooks/log.hook.ts#L32)*

Hook factory logging a message with optional information on the HTTP request.

*__export__*: 

**Parameters:**

| Name | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| message | `string` | - |  The message to print on each request. |
| `Default value` options | [LogOptions](../interfaces/_common_hooks_log_hook_.logoptions.md) |  {} |

**Returns:** [HookDecorator](_core_hooks_.md#hookdecorator)
The hook.

___

