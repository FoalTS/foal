[@foal/core](../README.md) > ["openapi/interfaces"](../modules/_openapi_interfaces_.md) > [IApiComponents](../interfaces/_openapi_interfaces_.iapicomponents.md)

# Interface: IApiComponents

Holds a set of reusable objects for different aspects of the OAS. All objects defined within the components object will have no effect on the API unless they are explicitly referenced from properties outside the components object.

Source: [https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md)

*__export__*: 

*__interface__*: IApiComponents

## Hierarchy

**IApiComponents**

## Index

### Properties

* [callbacks](_openapi_interfaces_.iapicomponents.md#callbacks)
* [examples](_openapi_interfaces_.iapicomponents.md#examples)
* [headers](_openapi_interfaces_.iapicomponents.md#headers)
* [links](_openapi_interfaces_.iapicomponents.md#links)
* [parameters](_openapi_interfaces_.iapicomponents.md#parameters)
* [requestBodies](_openapi_interfaces_.iapicomponents.md#requestbodies)
* [responses](_openapi_interfaces_.iapicomponents.md#responses)
* [schemas](_openapi_interfaces_.iapicomponents.md#schemas)
* [securitySchemes](_openapi_interfaces_.iapicomponents.md#securityschemes)

---

## Properties

<a id="callbacks"></a>

### `<Optional>` callbacks

**● callbacks**: *`undefined` \| `object`*

*Defined in [openapi/interfaces.ts:447](https://github.com/FoalTS/foal/blob/07f00115/packages/core/src/openapi/interfaces.ts#L447)*

An object to hold reusable Callback Objects.

Source: [https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md)

*__type__*: {({ \[key: string\]: IApiCallback \| IApiReference; })}

*__memberof__*: IApiComponents

___
<a id="examples"></a>

### `<Optional>` examples

**● examples**: *`undefined` \| `object`*

*Defined in [openapi/interfaces.ts:382](https://github.com/FoalTS/foal/blob/07f00115/packages/core/src/openapi/interfaces.ts#L382)*

An object to hold reusable Example Objects.

Source: [https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md)

*__type__*: {({ \[key: string\]: IApiExample \| IApiReference; })}

*__memberof__*: IApiComponents

___
<a id="headers"></a>

### `<Optional>` headers

**● headers**: *`undefined` \| `object`*

*Defined in [openapi/interfaces.ts:408](https://github.com/FoalTS/foal/blob/07f00115/packages/core/src/openapi/interfaces.ts#L408)*

An object to hold reusable Header Objects.

Source: [https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md)

*__type__*: {({ \[key: string\]: IApiHeader \| IApiReference; })}

*__memberof__*: IApiComponents

___
<a id="links"></a>

### `<Optional>` links

**● links**: *`undefined` \| `object`*

*Defined in [openapi/interfaces.ts:434](https://github.com/FoalTS/foal/blob/07f00115/packages/core/src/openapi/interfaces.ts#L434)*

An object to hold reusable Link Objects.

Source: [https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md)

*__type__*: {({ \[key: string\]: IApiLink \| IApiReference; })}

*__memberof__*: IApiComponents

___
<a id="parameters"></a>

### `<Optional>` parameters

**● parameters**: *`undefined` \| `object`*

*Defined in [openapi/interfaces.ts:369](https://github.com/FoalTS/foal/blob/07f00115/packages/core/src/openapi/interfaces.ts#L369)*

An object to hold reusable Parameter Objects.

Source: [https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md)

*__type__*: {({ \[key: string\]: IApiParameter \| IApiReference; })}

*__memberof__*: IApiComponents

___
<a id="requestbodies"></a>

### `<Optional>` requestBodies

**● requestBodies**: *`undefined` \| `object`*

*Defined in [openapi/interfaces.ts:395](https://github.com/FoalTS/foal/blob/07f00115/packages/core/src/openapi/interfaces.ts#L395)*

An object to hold reusable Request Body Objects.

Source: [https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md)

*__type__*: {({ \[key: string\]: IApiRequestBody \| IApiReference; })}

*__memberof__*: IApiComponents

___
<a id="responses"></a>

### `<Optional>` responses

**● responses**: *`undefined` \| `object`*

*Defined in [openapi/interfaces.ts:356](https://github.com/FoalTS/foal/blob/07f00115/packages/core/src/openapi/interfaces.ts#L356)*

An object to hold reusable Response Objects.

Source: [https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md)

*__type__*: {({ \[key: string\]: IApiResponse \| IApiReference; })}

*__memberof__*: IApiComponents

___
<a id="schemas"></a>

### `<Optional>` schemas

**● schemas**: *`undefined` \| `object`*

*Defined in [openapi/interfaces.ts:343](https://github.com/FoalTS/foal/blob/07f00115/packages/core/src/openapi/interfaces.ts#L343)*

An object to hold reusable Schema Objects.

Source: [https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md)

*__type__*: {({ \[key: string\]: IApiSchema \| IApiReference; })}

*__memberof__*: IApiComponents

___
<a id="securityschemes"></a>

### `<Optional>` securitySchemes

**● securitySchemes**: *`undefined` \| `object`*

*Defined in [openapi/interfaces.ts:421](https://github.com/FoalTS/foal/blob/07f00115/packages/core/src/openapi/interfaces.ts#L421)*

An object to hold reusable Security Scheme Objects.

Source: [https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md)

*__type__*: {({ \[key: string\]: IApiSecurityScheme \| IApiReference; })}

*__memberof__*: IApiComponents

___

