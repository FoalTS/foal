[@foal/core](../README.md) > ["express/create-app"](../modules/_express_create_app_.md)

# External module: "express/create-app"

## Index

### Interfaces

* [ExpressApplication](../interfaces/_express_create_app_.expressapplication.md)
* [ExpressOptions](../interfaces/_express_create_app_.expressoptions.md)

### Functions

* [createAndInitApp](_express_create_app_.md#createandinitapp)
* [createApp](_express_create_app_.md#createapp)

---

## Functions

<a id="createandinitapp"></a>

###  createAndInitApp

▸ **createAndInitApp**(rootControllerClass: *[Class](_core_class_interface_.md#class)*, expressInstanceOrOptions?: *[ExpressApplication](../interfaces/_express_create_app_.expressapplication.md) \| [ExpressOptions](../interfaces/_express_create_app_.expressoptions.md)*): `Promise`<[ExpressApplication](../interfaces/_express_create_app_.expressapplication.md)>

*Defined in [express/create-app.ts:155](https://github.com/FoalTS/foal/blob/70cc46bd/packages/core/src/express/create-app.ts#L155)*

Create an Express application from the root controller and call its "init" method if it exists.

*__export__*: 

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| rootControllerClass | [Class](_core_class_interface_.md#class) |  The root controller, usually called \`AppController\` and located in \`src/app\`. |
| `Optional` expressInstanceOrOptions | [ExpressApplication](../interfaces/_express_create_app_.expressapplication.md) \| [ExpressOptions](../interfaces/_express_create_app_.expressoptions.md) |

**Returns:** `Promise`<[ExpressApplication](../interfaces/_express_create_app_.expressapplication.md)>
The express application.

___
<a id="createapp"></a>

###  createApp

▸ **createApp**(rootControllerClass: *[Class](_core_class_interface_.md#class)*, expressInstanceOrOptions?: *[ExpressApplication](../interfaces/_express_create_app_.expressapplication.md) \| [ExpressOptions](../interfaces/_express_create_app_.expressoptions.md)*): [ExpressApplication](../interfaces/_express_create_app_.expressapplication.md)

*Defined in [express/create-app.ts:42](https://github.com/FoalTS/foal/blob/70cc46bd/packages/core/src/express/create-app.ts#L42)*

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

