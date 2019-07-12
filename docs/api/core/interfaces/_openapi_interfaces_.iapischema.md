[@foal/core](../README.md) > ["openapi/interfaces"](../modules/_openapi_interfaces_.md) > [IApiSchema](../interfaces/_openapi_interfaces_.iapischema.md)

# Interface: IApiSchema

The Schema Object allows the definition of input and output data types. These types can be objects, but also primitives and arrays. This object is an extended subset of the JSON Schema Specification Wright Draft 00.

For more information about the properties, see JSON Schema Core and JSON Schema Validation. Unless stated otherwise, the property definitions follow the JSON Schema.

Source: [https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md)

*__export__*: 

*__interface__*: IApiSchema

## Hierarchy

**IApiSchema**

## Index

### Properties

* [additionalProperties](_openapi_interfaces_.iapischema.md#additionalproperties)
* [allOf](_openapi_interfaces_.iapischema.md#allof)
* [anyOf](_openapi_interfaces_.iapischema.md#anyof)
* [default](_openapi_interfaces_.iapischema.md#default)
* [deprecated](_openapi_interfaces_.iapischema.md#deprecated)
* [description](_openapi_interfaces_.iapischema.md#description)
* [discriminator](_openapi_interfaces_.iapischema.md#discriminator)
* [enum](_openapi_interfaces_.iapischema.md#enum)
* [example](_openapi_interfaces_.iapischema.md#example)
* [exclusiveMaximum](_openapi_interfaces_.iapischema.md#exclusivemaximum)
* [exclusiveMinimum](_openapi_interfaces_.iapischema.md#exclusiveminimum)
* [externalDocs](_openapi_interfaces_.iapischema.md#externaldocs)
* [format](_openapi_interfaces_.iapischema.md#format)
* [items](_openapi_interfaces_.iapischema.md#items)
* [maxItems](_openapi_interfaces_.iapischema.md#maxitems)
* [maxLength](_openapi_interfaces_.iapischema.md#maxlength)
* [maxProperties](_openapi_interfaces_.iapischema.md#maxproperties)
* [maximum](_openapi_interfaces_.iapischema.md#maximum)
* [minItems](_openapi_interfaces_.iapischema.md#minitems)
* [minLength](_openapi_interfaces_.iapischema.md#minlength)
* [minProperties](_openapi_interfaces_.iapischema.md#minproperties)
* [minimum](_openapi_interfaces_.iapischema.md#minimum)
* [multipleOf](_openapi_interfaces_.iapischema.md#multipleof)
* [not](_openapi_interfaces_.iapischema.md#not)
* [nullable](_openapi_interfaces_.iapischema.md#nullable)
* [oneOf](_openapi_interfaces_.iapischema.md#oneof)
* [pattern](_openapi_interfaces_.iapischema.md#pattern)
* [properties](_openapi_interfaces_.iapischema.md#properties)
* [readOnly](_openapi_interfaces_.iapischema.md#readonly)
* [required](_openapi_interfaces_.iapischema.md#required)
* [title](_openapi_interfaces_.iapischema.md#title)
* [type](_openapi_interfaces_.iapischema.md#type)
* [uniqueItems](_openapi_interfaces_.iapischema.md#uniqueitems)
* [writeOnly](_openapi_interfaces_.iapischema.md#writeonly)
* [xml](_openapi_interfaces_.iapischema.md#xml)

---

## Properties

<a id="additionalproperties"></a>

### `<Optional>` additionalProperties

**● additionalProperties**: *`boolean` \| [IApiSchema](_openapi_interfaces_.iapischema.md) \| [IApiReference](_openapi_interfaces_.iapireference.md)*

*Defined in [openapi/interfaces.ts:1658](https://github.com/FoalTS/foal/blob/07f00115/packages/core/src/openapi/interfaces.ts#L1658)*

___
<a id="allof"></a>

### `<Optional>` allOf

**● allOf**: *([IApiSchema](_openapi_interfaces_.iapischema.md) \| [IApiReference](_openapi_interfaces_.iapireference.md))[]*

*Defined in [openapi/interfaces.ts:1650](https://github.com/FoalTS/foal/blob/07f00115/packages/core/src/openapi/interfaces.ts#L1650)*

___
<a id="anyof"></a>

### `<Optional>` anyOf

**● anyOf**: *([IApiSchema](_openapi_interfaces_.iapischema.md) \| [IApiReference](_openapi_interfaces_.iapireference.md))[]*

*Defined in [openapi/interfaces.ts:1652](https://github.com/FoalTS/foal/blob/07f00115/packages/core/src/openapi/interfaces.ts#L1652)*

___
<a id="default"></a>

### `<Optional>` default

**● default**: *`any`*

*Defined in [openapi/interfaces.ts:1661](https://github.com/FoalTS/foal/blob/07f00115/packages/core/src/openapi/interfaces.ts#L1661)*

___
<a id="deprecated"></a>

### `<Optional>` deprecated

**● deprecated**: *`undefined` \| `false` \| `true`*

*Defined in [openapi/interfaces.ts:1747](https://github.com/FoalTS/foal/blob/07f00115/packages/core/src/openapi/interfaces.ts#L1747)*

Specifies that a schema is deprecated and SHOULD be transitioned out of usage. Default value is false.

Source: [https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md)

*__type__*: {boolean}

*__memberof__*: IApiSchema

___
<a id="description"></a>

### `<Optional>` description

**● description**: *`undefined` \| `string`*

*Defined in [openapi/interfaces.ts:1659](https://github.com/FoalTS/foal/blob/07f00115/packages/core/src/openapi/interfaces.ts#L1659)*

___
<a id="discriminator"></a>

### `<Optional>` discriminator

**● discriminator**: *[IApiDiscriminator](_openapi_interfaces_.iapidiscriminator.md)*

*Defined in [openapi/interfaces.ts:1681](https://github.com/FoalTS/foal/blob/07f00115/packages/core/src/openapi/interfaces.ts#L1681)*

Adds support for polymorphism. The discriminator is an object name that is used to differentiate between other schemas which may satisfy the payload description. See Composition and Inheritance for more details.

Source: [https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md)

*__type__*: {boolean}

*__memberof__*: IApiSchema

___
<a id="enum"></a>

### `<Optional>` enum

**● enum**: *`any`[]*

*Defined in [openapi/interfaces.ts:1648](https://github.com/FoalTS/foal/blob/07f00115/packages/core/src/openapi/interfaces.ts#L1648)*

___
<a id="example"></a>

### `<Optional>` example

**● example**: *`any`*

*Defined in [openapi/interfaces.ts:1737](https://github.com/FoalTS/foal/blob/07f00115/packages/core/src/openapi/interfaces.ts#L1737)*

A free-form property to include an example of an instance for this schema. To represent examples that cannot be naturally represented in JSON or YAML, a string value can be used to contain the example with escaping where necessary.

Source: [https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md)

*__type__*: {\*}

*__memberof__*: IApiSchema

___
<a id="exclusivemaximum"></a>

### `<Optional>` exclusiveMaximum

**● exclusiveMaximum**: *`undefined` \| `number`*

*Defined in [openapi/interfaces.ts:1636](https://github.com/FoalTS/foal/blob/07f00115/packages/core/src/openapi/interfaces.ts#L1636)*

___
<a id="exclusiveminimum"></a>

### `<Optional>` exclusiveMinimum

**● exclusiveMinimum**: *`undefined` \| `number`*

*Defined in [openapi/interfaces.ts:1638](https://github.com/FoalTS/foal/blob/07f00115/packages/core/src/openapi/interfaces.ts#L1638)*

___
<a id="externaldocs"></a>

### `<Optional>` externalDocs

**● externalDocs**: *[IApiExternalDocumentation](_openapi_interfaces_.iapiexternaldocumentation.md)*

*Defined in [openapi/interfaces.ts:1726](https://github.com/FoalTS/foal/blob/07f00115/packages/core/src/openapi/interfaces.ts#L1726)*

Additional external documentation for this schema.

Source: [https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md)

*__type__*: {IApiExternalDocumentation}

*__memberof__*: IApiSchema

___
<a id="format"></a>

### `<Optional>` format

**● format**: *`undefined` \| `string`*

*Defined in [openapi/interfaces.ts:1660](https://github.com/FoalTS/foal/blob/07f00115/packages/core/src/openapi/interfaces.ts#L1660)*

___
<a id="items"></a>

### `<Optional>` items

**● items**: *[IApiSchema](_openapi_interfaces_.iapischema.md) \| [IApiReference](_openapi_interfaces_.iapireference.md)*

*Defined in [openapi/interfaces.ts:1654](https://github.com/FoalTS/foal/blob/07f00115/packages/core/src/openapi/interfaces.ts#L1654)*

___
<a id="maxitems"></a>

### `<Optional>` maxItems

**● maxItems**: *`undefined` \| `number`*

*Defined in [openapi/interfaces.ts:1642](https://github.com/FoalTS/foal/blob/07f00115/packages/core/src/openapi/interfaces.ts#L1642)*

___
<a id="maxlength"></a>

### `<Optional>` maxLength

**● maxLength**: *`undefined` \| `number`*

*Defined in [openapi/interfaces.ts:1639](https://github.com/FoalTS/foal/blob/07f00115/packages/core/src/openapi/interfaces.ts#L1639)*

___
<a id="maxproperties"></a>

### `<Optional>` maxProperties

**● maxProperties**: *`undefined` \| `number`*

*Defined in [openapi/interfaces.ts:1645](https://github.com/FoalTS/foal/blob/07f00115/packages/core/src/openapi/interfaces.ts#L1645)*

___
<a id="maximum"></a>

### `<Optional>` maximum

**● maximum**: *`undefined` \| `number`*

*Defined in [openapi/interfaces.ts:1635](https://github.com/FoalTS/foal/blob/07f00115/packages/core/src/openapi/interfaces.ts#L1635)*

___
<a id="minitems"></a>

### `<Optional>` minItems

**● minItems**: *`undefined` \| `number`*

*Defined in [openapi/interfaces.ts:1643](https://github.com/FoalTS/foal/blob/07f00115/packages/core/src/openapi/interfaces.ts#L1643)*

___
<a id="minlength"></a>

### `<Optional>` minLength

**● minLength**: *`undefined` \| `number`*

*Defined in [openapi/interfaces.ts:1640](https://github.com/FoalTS/foal/blob/07f00115/packages/core/src/openapi/interfaces.ts#L1640)*

___
<a id="minproperties"></a>

### `<Optional>` minProperties

**● minProperties**: *`undefined` \| `number`*

*Defined in [openapi/interfaces.ts:1646](https://github.com/FoalTS/foal/blob/07f00115/packages/core/src/openapi/interfaces.ts#L1646)*

___
<a id="minimum"></a>

### `<Optional>` minimum

**● minimum**: *`undefined` \| `number`*

*Defined in [openapi/interfaces.ts:1637](https://github.com/FoalTS/foal/blob/07f00115/packages/core/src/openapi/interfaces.ts#L1637)*

___
<a id="multipleof"></a>

### `<Optional>` multipleOf

**● multipleOf**: *`undefined` \| `number`*

*Defined in [openapi/interfaces.ts:1634](https://github.com/FoalTS/foal/blob/07f00115/packages/core/src/openapi/interfaces.ts#L1634)*

___
<a id="not"></a>

### `<Optional>` not

**● not**: *[IApiSchema](_openapi_interfaces_.iapischema.md) \| [IApiReference](_openapi_interfaces_.iapireference.md)*

*Defined in [openapi/interfaces.ts:1653](https://github.com/FoalTS/foal/blob/07f00115/packages/core/src/openapi/interfaces.ts#L1653)*

___
<a id="nullable"></a>

### `<Optional>` nullable

**● nullable**: *`undefined` \| `false` \| `true`*

*Defined in [openapi/interfaces.ts:1670](https://github.com/FoalTS/foal/blob/07f00115/packages/core/src/openapi/interfaces.ts#L1670)*

Allows sending a null value for the defined schema. Default value is false.

Source: [https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md)

*__type__*: {boolean}

*__memberof__*: IApiSchema

___
<a id="oneof"></a>

### `<Optional>` oneOf

**● oneOf**: *([IApiSchema](_openapi_interfaces_.iapischema.md) \| [IApiReference](_openapi_interfaces_.iapireference.md))[]*

*Defined in [openapi/interfaces.ts:1651](https://github.com/FoalTS/foal/blob/07f00115/packages/core/src/openapi/interfaces.ts#L1651)*

___
<a id="pattern"></a>

### `<Optional>` pattern

**● pattern**: *`undefined` \| `string`*

*Defined in [openapi/interfaces.ts:1641](https://github.com/FoalTS/foal/blob/07f00115/packages/core/src/openapi/interfaces.ts#L1641)*

___
<a id="properties"></a>

### `<Optional>` properties

**● properties**: *`undefined` \| `object`*

*Defined in [openapi/interfaces.ts:1655](https://github.com/FoalTS/foal/blob/07f00115/packages/core/src/openapi/interfaces.ts#L1655)*

___
<a id="readonly"></a>

### `<Optional>` readOnly

**● readOnly**: *`undefined` \| `false` \| `true`*

*Defined in [openapi/interfaces.ts:1694](https://github.com/FoalTS/foal/blob/07f00115/packages/core/src/openapi/interfaces.ts#L1694)*

Relevant only for Schema "properties" definitions. Declares the property as "read only". This means that it MAY be sent as part of a response but SHOULD NOT be sent as part of the request. If the property is marked as readOnly being true and is in the required list, the required will take effect on the response only. A property MUST NOT be marked as both readOnly and writeOnly being true. Default value is false.

Source: [https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md)

*__type__*: {boolean}

*__memberof__*: IApiSchema

___
<a id="required"></a>

### `<Optional>` required

**● required**: *`string`[]*

*Defined in [openapi/interfaces.ts:1647](https://github.com/FoalTS/foal/blob/07f00115/packages/core/src/openapi/interfaces.ts#L1647)*

___
<a id="title"></a>

### `<Optional>` title

**● title**: *`undefined` \| `string`*

*Defined in [openapi/interfaces.ts:1633](https://github.com/FoalTS/foal/blob/07f00115/packages/core/src/openapi/interfaces.ts#L1633)*

___
<a id="type"></a>

### `<Optional>` type

**● type**: *"null" \| "boolean" \| "object" \| "array" \| "number" \| "string" \| "integer"*

*Defined in [openapi/interfaces.ts:1649](https://github.com/FoalTS/foal/blob/07f00115/packages/core/src/openapi/interfaces.ts#L1649)*

___
<a id="uniqueitems"></a>

### `<Optional>` uniqueItems

**● uniqueItems**: *`undefined` \| `false` \| `true`*

*Defined in [openapi/interfaces.ts:1644](https://github.com/FoalTS/foal/blob/07f00115/packages/core/src/openapi/interfaces.ts#L1644)*

___
<a id="writeonly"></a>

### `<Optional>` writeOnly

**● writeOnly**: *`undefined` \| `false` \| `true`*

*Defined in [openapi/interfaces.ts:1707](https://github.com/FoalTS/foal/blob/07f00115/packages/core/src/openapi/interfaces.ts#L1707)*

Relevant only for Schema "properties" definitions. Declares the property as "write only". Therefore, it MAY be sent as part of a request but SHOULD NOT be sent as part of the response. If the property is marked as writeOnly being true and is in the required list, the required will take effect on the request only. A property MUST NOT be marked as both readOnly and writeOnly being true. Default value is false.

Source: [https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md)

*__type__*: {boolean}

*__memberof__*: IApiSchema

___
<a id="xml"></a>

### `<Optional>` xml

**● xml**: *[IApiXML](_openapi_interfaces_.iapixml.md)*

*Defined in [openapi/interfaces.ts:1717](https://github.com/FoalTS/foal/blob/07f00115/packages/core/src/openapi/interfaces.ts#L1717)*

This MAY be used only on properties schemas. It has no effect on root schemas. Adds additional metadata to describe the XML representation of this property.

Source: [https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md)

*__type__*: {IApiXML}

*__memberof__*: IApiSchema

___

