[@foal/graphql](../README.md) > ["graphql.controller"](../modules/_graphql_controller_.md)

# External module: "graphql.controller"

## Index

### Classes

* [GraphQLController](../classes/_graphql_controller_.graphqlcontroller.md)

### Variables

* [ajv](_graphql_controller_.md#ajv)

### Functions

* [sanitize](_graphql_controller_.md#sanitize)

### Object literals

* [getQuerySchema](_graphql_controller_.md#getqueryschema)
* [postBodySchema](_graphql_controller_.md#postbodyschema)

---

## Variables

<a id="ajv"></a>

### `<Const>` ajv

**● ajv**: *`Ajv`* =  new Ajv()

*Defined in [graphql.controller.ts:30](https://github.com/FoalTS/foal/blob/aac11366/packages/graphql/src/graphql.controller.ts#L30)*

___

## Functions

<a id="sanitize"></a>

###  sanitize

▸ **sanitize**(o: *`object`*): `object`

*Defined in [graphql.controller.ts:26](https://github.com/FoalTS/foal/blob/aac11366/packages/graphql/src/graphql.controller.ts#L26)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| o | `object` |

**Returns:** `object`

___

## Object literals

<a id="getqueryschema"></a>

### `<Const>` getQuerySchema

**getQuerySchema**: *`object`*

*Defined in [graphql.controller.ts:6](https://github.com/FoalTS/foal/blob/aac11366/packages/graphql/src/graphql.controller.ts#L6)*

<a id="getqueryschema.required"></a>

####  required

**● required**: *`string`[]* =  ['query']

*Defined in [graphql.controller.ts:12](https://github.com/FoalTS/foal/blob/aac11366/packages/graphql/src/graphql.controller.ts#L12)*

___
<a id="getqueryschema.type"></a>

####  type

**● type**: *`string`* = "object"

*Defined in [graphql.controller.ts:13](https://github.com/FoalTS/foal/blob/aac11366/packages/graphql/src/graphql.controller.ts#L13)*

___
<a id="getqueryschema.properties"></a>

####  properties

**properties**: *`object`*

*Defined in [graphql.controller.ts:7](https://github.com/FoalTS/foal/blob/aac11366/packages/graphql/src/graphql.controller.ts#L7)*

<a id="getqueryschema.properties.operationname"></a>

####  operationName

**operationName**: *`object`*

*Defined in [graphql.controller.ts:8](https://github.com/FoalTS/foal/blob/aac11366/packages/graphql/src/graphql.controller.ts#L8)*

<a id="getqueryschema.properties.operationname.type-1"></a>

####  type

**● type**: *`string`* = "string"

*Defined in [graphql.controller.ts:8](https://github.com/FoalTS/foal/blob/aac11366/packages/graphql/src/graphql.controller.ts#L8)*

___

___
<a id="getqueryschema.properties.query"></a>

####  query

**query**: *`object`*

*Defined in [graphql.controller.ts:9](https://github.com/FoalTS/foal/blob/aac11366/packages/graphql/src/graphql.controller.ts#L9)*

<a id="getqueryschema.properties.query.type-2"></a>

####  type

**● type**: *`string`* = "string"

*Defined in [graphql.controller.ts:9](https://github.com/FoalTS/foal/blob/aac11366/packages/graphql/src/graphql.controller.ts#L9)*

___

___
<a id="getqueryschema.properties.variables"></a>

####  variables

**variables**: *`object`*

*Defined in [graphql.controller.ts:10](https://github.com/FoalTS/foal/blob/aac11366/packages/graphql/src/graphql.controller.ts#L10)*

<a id="getqueryschema.properties.variables.type-3"></a>

####  type

**● type**: *`string`* = "string"

*Defined in [graphql.controller.ts:10](https://github.com/FoalTS/foal/blob/aac11366/packages/graphql/src/graphql.controller.ts#L10)*

___

___

___

___
<a id="postbodyschema"></a>

### `<Const>` postBodySchema

**postBodySchema**: *`object`*

*Defined in [graphql.controller.ts:16](https://github.com/FoalTS/foal/blob/aac11366/packages/graphql/src/graphql.controller.ts#L16)*

<a id="postbodyschema.required-1"></a>

####  required

**● required**: *`string`[]* =  ['query']

*Defined in [graphql.controller.ts:22](https://github.com/FoalTS/foal/blob/aac11366/packages/graphql/src/graphql.controller.ts#L22)*

___
<a id="postbodyschema.type-4"></a>

####  type

**● type**: *`string`* = "object"

*Defined in [graphql.controller.ts:23](https://github.com/FoalTS/foal/blob/aac11366/packages/graphql/src/graphql.controller.ts#L23)*

___
<a id="postbodyschema.properties-1"></a>

####  properties

**properties**: *`object`*

*Defined in [graphql.controller.ts:17](https://github.com/FoalTS/foal/blob/aac11366/packages/graphql/src/graphql.controller.ts#L17)*

<a id="postbodyschema.properties-1.operationname-1"></a>

####  operationName

**operationName**: *`object`*

*Defined in [graphql.controller.ts:18](https://github.com/FoalTS/foal/blob/aac11366/packages/graphql/src/graphql.controller.ts#L18)*

<a id="postbodyschema.properties-1.operationname-1.type-5"></a>

####  type

**● type**: *`string`* = "string"

*Defined in [graphql.controller.ts:18](https://github.com/FoalTS/foal/blob/aac11366/packages/graphql/src/graphql.controller.ts#L18)*

___

___
<a id="postbodyschema.properties-1.query-1"></a>

####  query

**query**: *`object`*

*Defined in [graphql.controller.ts:19](https://github.com/FoalTS/foal/blob/aac11366/packages/graphql/src/graphql.controller.ts#L19)*

<a id="postbodyschema.properties-1.query-1.type-6"></a>

####  type

**● type**: *`string`* = "string"

*Defined in [graphql.controller.ts:19](https://github.com/FoalTS/foal/blob/aac11366/packages/graphql/src/graphql.controller.ts#L19)*

___

___
<a id="postbodyschema.properties-1.variables-1"></a>

####  variables

**variables**: *`object`*

*Defined in [graphql.controller.ts:20](https://github.com/FoalTS/foal/blob/aac11366/packages/graphql/src/graphql.controller.ts#L20)*

<a id="postbodyschema.properties-1.variables-1.type-7"></a>

####  type

**● type**: *`string`* = "object"

*Defined in [graphql.controller.ts:20](https://github.com/FoalTS/foal/blob/aac11366/packages/graphql/src/graphql.controller.ts#L20)*

___

___

___

___

