[@foal/core](../README.md) > ["express/create-app"](../modules/_express_create_app_.md)

# External module: "express/create-app"

## Index

### Interfaces

* [ExpressApplication](../interfaces/_express_create_app_.expressapplication.md)
* [ExpressOptions](../interfaces/_express_create_app_.expressoptions.md)

### Functions

* [createApp](_express_create_app_.md#createapp)

---

## Functions

<a id="createapp"></a>

###  createApp

▸ **createApp**(rootControllerClass: *[Class](_core_class_interface_.md#class)*, expressInstanceOrOptions?: *[ExpressApplication](../interfaces/_express_create_app_.expressapplication.md) \| [ExpressOptions](../interfaces/_express_create_app_.expressoptions.md)*): [ExpressApplication](../interfaces/_express_create_app_.expressapplication.md)

*Defined in [express/create-app.ts:40](https://github.com/FoalTS/foal/blob/aac11366/packages/core/src/express/create-app.ts#L40)*

Create an Express application from the root controller.

*__export__*: 

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| rootControllerClass | [Class](_core_class_interface_.md#class) |  The root controller, usually called \`AppController\` and located in \`src/app\`. |
| `Optional` expressInstanceOrOptions | [ExpressApplication](../interfaces/_express_create_app_.expressapplication.md) \| [ExpressOptions](../interfaces/_express_create_app_.expressoptions.md) |

**Returns:** [ExpressApplication](../interfaces/_express_create_app_.expressapplication.md)
The express application.

___

