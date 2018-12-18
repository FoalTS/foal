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

```typescript
function JWTOptional(options: JWTOptions = {}, verifyOptions: VerifyOptions = {}): HookDecorator;
```

**Parameters**

| Name          | Type                                 | Default value |
| ------------- | ------------------------------------ | ------------- |
| options       | [JWTOptions][InterfaceDeclaration-0] | {}            |
| verifyOptions | VerifyOptions                        | {}            |

**Return type**

HookDecorator

----------

### JWTRequired

```typescript
function JWTRequired(options: JWTOptions = {}, verifyOptions: VerifyOptions = {}): HookDecorator;
```

**Parameters**

| Name          | Type                                 | Default value |
| ------------- | ------------------------------------ | ------------- |
| options       | [JWTOptions][InterfaceDeclaration-0] | {}            |
| verifyOptions | VerifyOptions                        | {}            |

**Return type**

HookDecorator

## Interfaces

### JWTOptions

```typescript
interface JWTOptions {
    user?: ((id: string | number) => Promise<any>) | undefined;
    blackList?: ((token: string) => boolean | Promise<boolean>) | undefined;
}
```

**Properties**

| Name      | Type                                                                  | Optional |
| --------- | --------------------------------------------------------------------- | -------- |
| user      | ((id: string &#124; number) => Promise<any>) &#124; undefined         | true     |
| blackList | ((token: string) => boolean &#124; Promise<boolean>) &#124; undefined | true     |

[SourceFile-0]: index.md#indexts
[FunctionDeclaration-0]: index.md#jwtoptional
[InterfaceDeclaration-0]: index.md#jwtoptions
[FunctionDeclaration-1]: index.md#jwtrequired
[InterfaceDeclaration-0]: index.md#jwtoptions
[InterfaceDeclaration-0]: index.md#jwtoptions