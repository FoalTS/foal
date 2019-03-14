# Table of contents

* [index.ts][SourceFile-0]
    * Functions
        * [JWTOptional][FunctionDeclaration-0]
        * [JWTRequired][FunctionDeclaration-1]
    * Interfaces
        * [JWTOptions][InterfaceDeclaration-0]

# index.ts

## Functions

### JWTOptional

Hook factory to authenticate users using JSON Web Tokens.

The hook does not return any error when no user could be authenticated.

If `options.cookie` is not defined, the hook expects the JWT to be included in the
`Authorization` header using the `Bearer` schema. Once the token is verified and decoded,
`ctx.user` is set with the payload (by default) or a custom object (see `options.user`).

The content of the header should look like the following: Authorization: Bearer <token>

```typescript
function JWTOptional(options: JWTOptions = {}, verifyOptions: VerifyOptions = {}): HookDecorator;
```

**Parameters**

| Name          | Type                                 | Default value | Description                              |
| ------------- | ------------------------------------ | ------------- | ---------------------------------------- |
| options       | [JWTOptions][InterfaceDeclaration-0] | {}            | - Hook options.                          |
| verifyOptions | VerifyOptions                        | {}            | - Options of the `jsonwebtoken` package. |

**Return type**

HookDecorator

----------

### JWTRequired

Hook factory to authenticate users using JSON Web Tokens.

The hook returns a 401 error if no user could be authenticated.

If `options.cookie` is not defined, the hook expects the JWT to be included in the
`Authorization` header using the `Bearer` schema. Once the token is verified and decoded,
`ctx.user` is set with the payload (by default) or a custom object (see `options.user`).

The content of the header should look like the following: Authorization: Bearer <token>

```typescript
function JWTRequired(options: JWTOptions = {}, verifyOptions: VerifyOptions = {}): HookDecorator;
```

**Parameters**

| Name          | Type                                 | Default value | Description                              |
| ------------- | ------------------------------------ | ------------- | ---------------------------------------- |
| options       | [JWTOptions][InterfaceDeclaration-0] | {}            | - Hook options.                          |
| verifyOptions | VerifyOptions                        | {}            | - Options of the `jsonwebtoken` package. |

**Return type**

HookDecorator

## Interfaces

### JWTOptions

Options of the hooks created by JWTRequired and JWTOptional.

```typescript
interface JWTOptions {
    user?: ((id: string | number) => Promise<any>) | undefined;
    blackList?: ((token: string) => boolean | Promise<boolean>) | undefined;
    cookie?: boolean | undefined;
}
```

**Properties**

| Name      | Type                                                                  | Optional |
| --------- | --------------------------------------------------------------------- | -------- |
| user      | ((id: string &#124; number) => Promise<any>) &#124; undefined         | true     |
| blackList | ((token: string) => boolean &#124; Promise<boolean>) &#124; undefined | true     |
| cookie    | boolean &#124; undefined                                              | true     |

[SourceFile-0]: index.md#indexts
[FunctionDeclaration-0]: index.md#jwtoptional
[InterfaceDeclaration-0]: index.md#jwtoptions
[FunctionDeclaration-1]: index.md#jwtrequired
[InterfaceDeclaration-0]: index.md#jwtoptions
[InterfaceDeclaration-0]: index.md#jwtoptions