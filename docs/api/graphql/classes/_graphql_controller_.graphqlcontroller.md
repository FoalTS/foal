[@foal/graphql](../README.md) > ["graphql.controller"](../modules/_graphql_controller_.md) > [GraphQLController](../classes/_graphql_controller_.graphqlcontroller.md)

# Class: GraphQLController

GraphQL controller compatible compatible with the common GraphQL clients ([graphql-request](https://www.npmjs.com/package/graphql-request), [Apollo Client](https://www.apollographql.com/docs/react/), etc) or any client that follows the HTTP specification defined [here](https://graphql.org/learn/serving-over-http/).

*__export__*: 

*__abstract__*: 

*__class__*: GraphQLController

## Hierarchy

**GraphQLController**

## Index

### Properties

* [resolvers](_graphql_controller_.graphqlcontroller.md#resolvers)
* [schema](_graphql_controller_.graphqlcontroller.md#schema)

### Methods

* [get](_graphql_controller_.graphqlcontroller.md#get)
* [getResolverContext](_graphql_controller_.graphqlcontroller.md#getresolvercontext)
* [post](_graphql_controller_.graphqlcontroller.md#post)
* [postApplicationGraphQL](_graphql_controller_.graphqlcontroller.md#postapplicationgraphql)

---

## Properties

<a id="resolvers"></a>

###  resolvers

**● resolvers**: *`object`*

*Defined in [graphql.controller.ts:44](https://github.com/FoalTS/foal/blob/70cc46bd/packages/graphql/src/graphql.controller.ts#L44)*

___
<a id="schema"></a>

### `<Abstract>` schema

**● schema**: *`object` \| `Promise`<`object`>*

*Defined in [graphql.controller.ts:43](https://github.com/FoalTS/foal/blob/70cc46bd/packages/graphql/src/graphql.controller.ts#L43)*

___

## Methods

<a id="get"></a>

###  get

▸ **get**(ctx: *`Context`*): `Promise`<`HttpResponseBadRequest` \| `HttpResponseOK`>

*Defined in [graphql.controller.ts:51](https://github.com/FoalTS/foal/blob/70cc46bd/packages/graphql/src/graphql.controller.ts#L51)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| ctx | `Context` |

**Returns:** `Promise`<`HttpResponseBadRequest` \| `HttpResponseOK`>

___
<a id="getresolvercontext"></a>

###  getResolverContext

▸ **getResolverContext**(ctx: *`Context`*): `object`

*Defined in [graphql.controller.ts:46](https://github.com/FoalTS/foal/blob/70cc46bd/packages/graphql/src/graphql.controller.ts#L46)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| ctx | `Context` |

**Returns:** `object`

___
<a id="post"></a>

###  post

▸ **post**(ctx: *`Context`*): `Promise`<`HttpResponse`>

*Defined in [graphql.controller.ts:79](https://github.com/FoalTS/foal/blob/70cc46bd/packages/graphql/src/graphql.controller.ts#L79)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| ctx | `Context` |

**Returns:** `Promise`<`HttpResponse`>

___
<a id="postapplicationgraphql"></a>

### `<Private>` postApplicationGraphQL

▸ **postApplicationGraphQL**(ctx: *`Context`*): `Promise`<`HttpResponse`>

*Defined in [graphql.controller.ts:104](https://github.com/FoalTS/foal/blob/70cc46bd/packages/graphql/src/graphql.controller.ts#L104)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| ctx | `Context` |

**Returns:** `Promise`<`HttpResponse`>

___

