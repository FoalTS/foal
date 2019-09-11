[@foal/graphql](../README.md) > ["schema-from-type-paths"](../modules/_schema_from_type_paths_.md)

# External module: "schema-from-type-paths"

## Index

### Functions

* [schemaFromTypePaths](_schema_from_type_paths_.md#schemafromtypepaths)

---

## Functions

<a id="schemafromtypepaths"></a>

###  schemaFromTypePaths

▸ **schemaFromTypePaths**(...paths: *`string`[]*): `Promise`<`object`>

*Defined in [schema-from-type-paths.ts:12](https://github.com/FoalTS/foal/blob/aac11366/packages/graphql/src/schema-from-type-paths.ts#L12)*

Build a GraphQL schema from several files containing the type definitions.

*__export__*: 

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| `Rest` paths | `string`[] |  The path of the files. |

**Returns:** `Promise`<`object`>
The GraphQL schema.

___

