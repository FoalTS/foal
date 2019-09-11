[@foal/core](../README.md) > ["openapi/interfaces"](../modules/_openapi_interfaces_.md) > [IApiOperation](../interfaces/_openapi_interfaces_.iapioperation.md)

# Interface: IApiOperation

Describes a single API operation on a path.

Source: [https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md)

*__export__*: 

*__interface__*: IApiOperation

## Hierarchy

**IApiOperation**

## Index

### Properties

* [callbacks](_openapi_interfaces_.iapioperation.md#callbacks)
* [deprecated](_openapi_interfaces_.iapioperation.md#deprecated)
* [description](_openapi_interfaces_.iapioperation.md#description)
* [externalDocs](_openapi_interfaces_.iapioperation.md#externaldocs)
* [operationId](_openapi_interfaces_.iapioperation.md#operationid)
* [parameters](_openapi_interfaces_.iapioperation.md#parameters)
* [requestBody](_openapi_interfaces_.iapioperation.md#requestbody)
* [responses](_openapi_interfaces_.iapioperation.md#responses)
* [security](_openapi_interfaces_.iapioperation.md#security)
* [servers](_openapi_interfaces_.iapioperation.md#servers)
* [summary](_openapi_interfaces_.iapioperation.md#summary)
* [tags](_openapi_interfaces_.iapioperation.md#tags)

---

## Properties

<a id="callbacks"></a>

### `<Optional>` callbacks

**● callbacks**: *`undefined` \| `object`*

*Defined in [openapi/interfaces.ts:725](https://github.com/FoalTS/foal/blob/aac11366/packages/core/src/openapi/interfaces.ts#L725)*

A map of possible out-of band callbacks related to the parent operation. The key is a unique identifier for the Callback Object. Each value in the map is a Callback Object that describes a request that may be initiated by the API provider and the expected responses. The key value used to identify the callback object is an expression, evaluated at runtime, that identifies a URL to use for the callback operation.

Source: [https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md)

*__type__*: {({ \[key: string\]: IApiCallback \| IApiReference; })}

*__memberof__*: IApiOperation

___
<a id="deprecated"></a>

### `<Optional>` deprecated

**● deprecated**: *`undefined` \| `false` \| `true`*

*Defined in [openapi/interfaces.ts:737](https://github.com/FoalTS/foal/blob/aac11366/packages/core/src/openapi/interfaces.ts#L737)*

Declares this operation to be deprecated. Consumers SHOULD refrain from usage of the declared operation. Default value is false.

Source: [https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md)

*__type__*: {boolean}

*__memberof__*: IApiOperation

___
<a id="description"></a>

### `<Optional>` description

**● description**: *`undefined` \| `string`*

*Defined in [openapi/interfaces.ts:655](https://github.com/FoalTS/foal/blob/aac11366/packages/core/src/openapi/interfaces.ts#L655)*

A verbose explanation of the operation behavior. CommonMark syntax MAY be used for rich text representation.

Source: [https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md)

*__type__*: {string}

*__memberof__*: IApiOperation

___
<a id="externaldocs"></a>

### `<Optional>` externalDocs

**● externalDocs**: *[IApiExternalDocumentation](_openapi_interfaces_.iapiexternaldocumentation.md)*

*Defined in [openapi/interfaces.ts:664](https://github.com/FoalTS/foal/blob/aac11366/packages/core/src/openapi/interfaces.ts#L664)*

Additional external documentation for this operation.

Source: [https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md)

*__type__*: {IApiExternalDocumentation}

*__memberof__*: IApiOperation

___
<a id="operationid"></a>

### `<Optional>` operationId

**● operationId**: *`undefined` \| `string`*

*Defined in [openapi/interfaces.ts:676](https://github.com/FoalTS/foal/blob/aac11366/packages/core/src/openapi/interfaces.ts#L676)*

Unique string used to identify the operation. The id MUST be unique among all operations described in the API. The operationId value is case-sensitive. Tools and libraries MAY use the operationId to uniquely identify an operation, therefore, it is RECOMMENDED to follow common programming naming conventions.

Source: [https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md)

*__type__*: {string}

*__memberof__*: IApiOperation

___
<a id="parameters"></a>

### `<Optional>` parameters

**● parameters**: *([IApiReference](_openapi_interfaces_.iapireference.md) \| [IApiPathParameter](_openapi_interfaces_.iapipathparameter.md) \| [IApiQueryParameter](_openapi_interfaces_.iapiqueryparameter.md) \| [IApiHeaderParameter](_openapi_interfaces_.iapiheaderparameter.md) \| [IApiCookieParameter](_openapi_interfaces_.iapicookieparameter.md))[]*

*Defined in [openapi/interfaces.ts:689](https://github.com/FoalTS/foal/blob/aac11366/packages/core/src/openapi/interfaces.ts#L689)*

A list of parameters that are applicable for this operation. If a parameter is already defined at the Path Item, the new definition will override it but can never remove it. The list MUST NOT include duplicated parameters. A unique parameter is defined by a combination of a name and location. The list can use the Reference Object to link to parameters that are defined at the OpenAPI Object's components/parameters.

Source: [https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md)

*__type__*: {((IApiParameter \| IApiReference)\[\])}

*__memberof__*: IApiOperation

___
<a id="requestbody"></a>

### `<Optional>` requestBody

**● requestBody**: *[IApiRequestBody](_openapi_interfaces_.iapirequestbody.md) \| [IApiReference](_openapi_interfaces_.iapireference.md)*

*Defined in [openapi/interfaces.ts:701](https://github.com/FoalTS/foal/blob/aac11366/packages/core/src/openapi/interfaces.ts#L701)*

The request body applicable for this operation. The requestBody is only supported in HTTP methods where the HTTP 1.1 specification RFC7231 has explicitly defined semantics for request bodies. In other cases where the HTTP spec is vague, requestBody SHALL be ignored by consumers.

Source: [https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md)

*__type__*: {(IApiRequestBody \| IApiReference)}

*__memberof__*: IApiOperation

___
<a id="responses"></a>

###  responses

**● responses**: *[IApiResponses](_openapi_interfaces_.iapiresponses.md)*

*Defined in [openapi/interfaces.ts:710](https://github.com/FoalTS/foal/blob/aac11366/packages/core/src/openapi/interfaces.ts#L710)*

The list of possible responses as they are returned from executing this operation.

Source: [https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md)

*__type__*: {IApiResponse\[\]}

*__memberof__*: IApiOperation

___
<a id="security"></a>

### `<Optional>` security

**● security**: *[IApiSecurityRequirement](_openapi_interfaces_.iapisecurityrequirement.md)[]*

*Defined in [openapi/interfaces.ts:750](https://github.com/FoalTS/foal/blob/aac11366/packages/core/src/openapi/interfaces.ts#L750)*

A declaration of which security mechanisms can be used for this operation. The list of values includes alternative security requirement objects that can be used. Only one of the security requirement objects need to be satisfied to authorize a request. This definition overrides any declared top-level security. To remove a top-level security declaration, an empty array can be used.

Source: [https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md)

*__type__*: {IApiSecurityRequirement\[\]}

*__memberof__*: IApiOperation

___
<a id="servers"></a>

### `<Optional>` servers

**● servers**: *[IApiServer](_openapi_interfaces_.iapiserver.md)[]*

*Defined in [openapi/interfaces.ts:760](https://github.com/FoalTS/foal/blob/aac11366/packages/core/src/openapi/interfaces.ts#L760)*

An alternative server array to service this operation. If an alternative server object is specified at the Path Item Object or Root level, it will be overridden by this value.

Source: [https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md)

*__type__*: {IApiServer\[\]}

*__memberof__*: IApiOperation

___
<a id="summary"></a>

### `<Optional>` summary

**● summary**: *`undefined` \| `string`*

*Defined in [openapi/interfaces.ts:645](https://github.com/FoalTS/foal/blob/aac11366/packages/core/src/openapi/interfaces.ts#L645)*

A short summary of what the operation does.

Source: [https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md)

*__type__*: {string}

*__memberof__*: IApiOperation

___
<a id="tags"></a>

### `<Optional>` tags

**● tags**: *`string`[]*

*Defined in [openapi/interfaces.ts:636](https://github.com/FoalTS/foal/blob/aac11366/packages/core/src/openapi/interfaces.ts#L636)*

A list of tags for API documentation control. Tags can be used for logical grouping of operations by resources or any other qualifier.

Source: [https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md)

*__type__*: {string\[\]}

*__memberof__*: IApiOperation

___

