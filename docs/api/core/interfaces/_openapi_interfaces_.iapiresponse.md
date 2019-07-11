[@foal/core](../README.md) > ["openapi/interfaces"](../modules/_openapi_interfaces_.md) > [IApiResponse](../interfaces/_openapi_interfaces_.iapiresponse.md)

# Interface: IApiResponse

Describes a single response from an API Operation, including design-time, static links to operations based on the response.

Source: [https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md)

*__export__*: 

*__interface__*: IApiResponse

## Hierarchy

**IApiResponse**

## Index

### Properties

* [content](_openapi_interfaces_.iapiresponse.md#content)
* [description](_openapi_interfaces_.iapiresponse.md#description)
* [headers](_openapi_interfaces_.iapiresponse.md#headers)
* [links](_openapi_interfaces_.iapiresponse.md#links)

---

## Properties

<a id="content"></a>

### `<Optional>` content

**● content**: *`undefined` \| `object`*

*Defined in [openapi/interfaces.ts:1363](https://github.com/FoalTS/foal/blob/07f00115/packages/core/src/openapi/interfaces.ts#L1363)*

A map containing descriptions of potential response payloads. The key is a media type or media type range and the value describes it. For responses that match multiple keys, only the most specific key is applicable. e.g. text/plain overrides text/\*

Source: [https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md)

*__type__*: {{ \[key: string\]: IApiMediaType; }}

*__memberof__*: IApiResponse

___
<a id="description"></a>

###  description

**● description**: *`string`*

*Defined in [openapi/interfaces.ts:1334](https://github.com/FoalTS/foal/blob/07f00115/packages/core/src/openapi/interfaces.ts#L1334)*

A short description of the response. CommonMark syntax MAY be used for rich text representation.

Source: [https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md)

*__type__*: {string}

*__memberof__*: IApiResponse

___
<a id="headers"></a>

### `<Optional>` headers

**● headers**: *`undefined` \| `object`*

*Defined in [openapi/interfaces.ts:1347](https://github.com/FoalTS/foal/blob/07f00115/packages/core/src/openapi/interfaces.ts#L1347)*

Maps a header name to its definition. RFC7230 states header names are case insensitive. If a response header is defined with the name "Content-Type", it SHALL be ignored.

Source: [https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md)

*__type__*: {({ \[key: string\]: IApiHeader \| IApiReference; })}

*__memberof__*: IApiResponse

___
<a id="links"></a>

### `<Optional>` links

**● links**: *`undefined` \| `object`*

*Defined in [openapi/interfaces.ts:1378](https://github.com/FoalTS/foal/blob/07f00115/packages/core/src/openapi/interfaces.ts#L1378)*

A map of operations links that can be followed from the response. The key of the map is a short name for the link, following the naming constraints of the names for Component Objects.

Source: [https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md)

*__type__*: {({ \[key: string\]: IApiLink \| IApiReference; })}

*__memberof__*: IApiResponse

___

