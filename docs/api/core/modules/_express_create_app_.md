[@foal/core](../README.md) > ["express/create-app"](../modules/_express_create_app_.md)

# External module: "express/create-app"

## Index

### Interfaces

* [CreateAppOptions](../interfaces/_express_create_app_.createappoptions.md)

### Functions

* [createApp](_express_create_app_.md#createapp)

---

## Functions

<a id="createapp"></a>

###  createApp

▸ **createApp**(rootControllerClass: *[Class](_core_class_interface_.md#class)*, options?: *[CreateAppOptions](../interfaces/_express_create_app_.createappoptions.md)*, expressInstance?: *`any`*): `any`

*Defined in [express/create-app.ts:39](https://github.com/FoalTS/foal/blob/cf326d07/packages/core/src/express/create-app.ts#L39)*

Create an express application from the root controller of the Foal project.

*__export__*: 

**Parameters:**

| Name | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| rootControllerClass | [Class](_core_class_interface_.md#class) | - |  The root controller, usually called \`AppController\` and located in \`src/app\`. |
| `Default value` options | [CreateAppOptions](../interfaces/_express_create_app_.createappoptions.md) |  {} |
| `Optional` expressInstance | `any` | - |

**Returns:** `any`
The express application.

___

