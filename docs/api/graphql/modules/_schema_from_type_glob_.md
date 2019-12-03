[@foal/graphql](../README.md) > ["schema-from-type-glob"](../modules/_schema_from_type_glob_.md)

# External module: "schema-from-type-glob"

## Index

### Functions

* [schemaFromTypeGlob](_schema_from_type_glob_.md#schemafromtypeglob)

---

## Functions

<a id="schemafromtypeglob"></a>

###  schemaFromTypeGlob

▸ **schemaFromTypeGlob**(pattern: *`string`*): `Promise`<`object`>

*Defined in [schema-from-type-glob.ts:11](https://github.com/FoalTS/foal/blob/70cc46bd/packages/graphql/src/schema-from-type-glob.ts#L11)*

Build a GraphQL schema from several files containing the type definitions.

*__export__*: 

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| pattern | `string` |  A glob pattern describing the file paths. |

**Returns:** `Promise`<`object`>
The GraphQL schema.

___

