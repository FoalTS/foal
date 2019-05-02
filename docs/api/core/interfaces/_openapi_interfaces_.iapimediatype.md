[@foal/core](../README.md) > ["openapi/interfaces"](../modules/_openapi_interfaces_.md) > [IApiMediaType](../interfaces/_openapi_interfaces_.iapimediatype.md)

# Interface: IApiMediaType

Each Media Type Object provides schema and examples for the media type identified by its key.

Source: [https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md)

*__export__*: 

*__interface__*: IApiMediaType

## Hierarchy

**IApiMediaType**

## Index

### Properties

* [encoding](_openapi_interfaces_.iapimediatype.md#encoding)
* [example](_openapi_interfaces_.iapimediatype.md#example)
* [examples](_openapi_interfaces_.iapimediatype.md#examples)
* [schema](_openapi_interfaces_.iapimediatype.md#schema)

---

## Properties

<a id="encoding"></a>

### `<Optional>` encoding

**● encoding**: *`undefined` \| `object`*

*Defined in [openapi/interfaces.ts:1097](https://github.com/FoalTS/foal/blob/7934e4d7/packages/core/src/openapi/interfaces.ts#L1097)*

A map between a property name and its encoding information. The key, being the property name, MUST exist in the schema as a property. The encoding object SHALL only apply to requestBody objects when the media type is multipart or application/x-www-form-urlencoded.

Source: [https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md)

*__type__*: {{ \[key: string\]: IApiEncoding; }}

*__memberof__*: IApiMediaType

___
<a id="example"></a>

### `<Optional>` example

**● example**: *`any`*

*Defined in [openapi/interfaces.ts:1067](https://github.com/FoalTS/foal/blob/7934e4d7/packages/core/src/openapi/interfaces.ts#L1067)*

Example of the media type. The example object SHOULD be in the correct format as specified by the media type. The example field is mutually exclusive of the examples field. Furthermore, if referencing a schema which contains an example, the example value SHALL override the example provided by the schema.

Source: [https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md)

*__type__*: {\*}

*__memberof__*: IApiMediaType

___
<a id="examples"></a>

### `<Optional>` examples

**● examples**: *`undefined` \| `object`*

*Defined in [openapi/interfaces.ts:1081](https://github.com/FoalTS/foal/blob/7934e4d7/packages/core/src/openapi/interfaces.ts#L1081)*

Examples of the media type. Each example object SHOULD match the media type and specified schema if present. The examples field is mutually exclusive of the example field. Furthermore, if referencing a schema which contains an example, the examples value SHALL override the example provided by the schema.

Source: [https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md)

*__type__*: {({ \[key: string\]: IApiExample \| IApiReference; })}

*__memberof__*: IApiMediaType

___
<a id="schema"></a>

### `<Optional>` schema

**● schema**: *[IApiSchema](_openapi_interfaces_.iapischema.md) \| [IApiReference](_openapi_interfaces_.iapireference.md)*

*Defined in [openapi/interfaces.ts:1054](https://github.com/FoalTS/foal/blob/7934e4d7/packages/core/src/openapi/interfaces.ts#L1054)*

The schema defining the content of the request, response, or parameter.

Source: [https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md)

*__type__*: {(IApiSchema \| IApiReference)}

*__memberof__*: IApiMediaType

___

