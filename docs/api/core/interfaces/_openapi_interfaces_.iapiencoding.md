[@foal/core](../README.md) > ["openapi/interfaces"](../modules/_openapi_interfaces_.md) > [IApiEncoding](../interfaces/_openapi_interfaces_.iapiencoding.md)

# Interface: IApiEncoding

A single encoding definition applied to a single schema property.

Source: [https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md)

*__export__*: 

*__interface__*: IApiEncoding

## Hierarchy

**IApiEncoding**

## Index

### Properties

* [allowReserved](_openapi_interfaces_.iapiencoding.md#allowreserved)
* [contentType](_openapi_interfaces_.iapiencoding.md#contenttype)
* [explode](_openapi_interfaces_.iapiencoding.md#explode)
* [headers](_openapi_interfaces_.iapiencoding.md#headers)
* [style](_openapi_interfaces_.iapiencoding.md#style)

---

## Properties

<a id="allowreserved"></a>

### `<Optional>` allowReserved

**● allowReserved**: *`undefined` \| `false` \| `true`*

*Defined in [openapi/interfaces.ts:1177](https://github.com/FoalTS/foal/blob/aac11366/packages/core/src/openapi/interfaces.ts#L1177)*

Determines whether the parameter value SHOULD allow reserved characters, as defined by RFC3986 :/?#\[\]@!$&'()\*+,;= to be included without percent-encoding. The default value is false. This property SHALL be ignored if the request body media type is not application/x-www-form-urlencoded.

Source: [https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md)

*__type__*: {boolean}

*__memberof__*: IApiEncoding

___
<a id="contenttype"></a>

### `<Optional>` contentType

**● contentType**: *`undefined` \| `string`*

*Defined in [openapi/interfaces.ts:1124](https://github.com/FoalTS/foal/blob/aac11366/packages/core/src/openapi/interfaces.ts#L1124)*

The Content-Type for encoding a specific property. Default value depends on the property type: for string with format being binary – application/octet-stream; for other primitive types – text/plain; for object - application/json; for array – the default is defined based on the inner type. The value can be a specific media type (e.g. application/json), a wildcard media type (e.g. image/\*), or a comma-separated list of the two types.

Source: [https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md)

*__type__*: {string}

*__memberof__*: IApiEncoding

___
<a id="explode"></a>

### `<Optional>` explode

**● explode**: *`undefined` \| `false` \| `true`*

*Defined in [openapi/interfaces.ts:1165](https://github.com/FoalTS/foal/blob/aac11366/packages/core/src/openapi/interfaces.ts#L1165)*

When this is true, property values of type array or object generate separate parameters for each value of the array, or key-value-pair of the map. For other types of properties this property has no effect. When style is form, the default value is true. For all other styles, the default value is false. This property SHALL be ignored if the request body media type is not application/x-www-form-urlencoded.

Source: [https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md)

*__type__*: {boolean}

*__memberof__*: IApiEncoding

___
<a id="headers"></a>

### `<Optional>` headers

**● headers**: *`undefined` \| `object`*

*Defined in [openapi/interfaces.ts:1138](https://github.com/FoalTS/foal/blob/aac11366/packages/core/src/openapi/interfaces.ts#L1138)*

A map allowing additional information to be provided as headers, for example Content-Disposition. Content-Type is described separately and SHALL be ignored in this section. This property SHALL be ignored if the request body media type is not a multipart.

Source: [https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md)

*__type__*: {({ \[key: string\]: IApiHeader \| IApiReference; })}

*__memberof__*: IApiEncoding

___
<a id="style"></a>

### `<Optional>` style

**● style**: *"matrix" \| "label" \| "form" \| "simple" \| "spaceDelimited" \| "pipeDelimited" \| "deepObject"*

*Defined in [openapi/interfaces.ts:1152](https://github.com/FoalTS/foal/blob/aac11366/packages/core/src/openapi/interfaces.ts#L1152)*

Describes how a specific property value will be serialized depending on its type. See Parameter Object for details on the style property. The behavior follows the same values as query parameters, including default values. This property SHALL be ignored if the request body media type is not application/x-www-form-urlencoded.

Source: [https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md)

*__type__*: {string}

*__memberof__*: IApiEncoding

___

