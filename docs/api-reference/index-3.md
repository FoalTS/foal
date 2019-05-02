# @foal/jwt

## Table of contents

* [index.ts](index-3.md#indexts)
  * Functions
    * [JWTOptional](index-3.md#jwtoptional)
    * [JWTRequired](index-3.md#jwtrequired)
  * Interfaces
    * [JWTOptions](index-3.md#jwtoptions)

## index.ts

### Functions

#### JWTOptional

Hook factory to authenticate users using JSON Web Tokens.

The hook does not return any error when no user could be authenticated.

If `options.cookie` is not defined, the hook expects the JWT to be included in the `Authorization` header using the `Bearer` schema. Once the token is verified and decoded, `ctx.user` is set with the payload \(by default\) or a custom object \(see `options.user`\).

The content of the header should look like the following: Authorization: Bearer 

```typescript
function JWTOptional(options: JWTOptions = {}, verifyOptions: VerifyOptions = {}): HookDecorator;
```

**Parameters**

| Name | Type | Default value | Description |
| :--- | :--- | :--- | :--- |
| options | [JWTOptions](index-3.md#jwtoptions) | {} | - Hook options. |
| verifyOptions | VerifyOptions | {} | - Options of the `jsonwebtoken` package. |

**Return type**

HookDecorator

#### JWTRequired

Hook factory to authenticate users using JSON Web Tokens.

The hook returns a 401 error if no user could be authenticated.

If `options.cookie` is not defined, the hook expects the JWT to be included in the `Authorization` header using the `Bearer` schema. Once the token is verified and decoded, `ctx.user` is set with the payload \(by default\) or a custom object \(see `options.user`\).

The content of the header should look like the following: Authorization: Bearer 

```typescript
function JWTRequired(options: JWTOptions = {}, verifyOptions: VerifyOptions = {}): HookDecorator;
```

**Parameters**

| Name | Type | Default value | Description |
| :--- | :--- | :--- | :--- |
| options | [JWTOptions](index-3.md#jwtoptions) | {} | - Hook options. |
| verifyOptions | VerifyOptions | {} | - Options of the `jsonwebtoken` package. |

**Return type**

HookDecorator

### Interfaces

#### JWTOptions

Options of the hooks created by JWTRequired and JWTOptional.

```typescript
interface JWTOptions {
    user?: ((id: string | number) => Promise<any>) | undefined;
    blackList?: ((token: string) => boolean | Promise<boolean>) | undefined;
    cookie?: boolean | undefined;
}
```

**Properties**

| Name | Type | Optional |
| :--- | :--- | :--- |
| user | \(\(id: string \| number\) =&gt; Promise\) \| undefined | true |
| blackList | \(\(token: string\) =&gt; boolean \| Promise\) \| undefined | true |
| cookie | boolean \| undefined | true |

[InterfaceDeclaration-0](index-3.md#jwtoptions): index.md\#jwtoptions

