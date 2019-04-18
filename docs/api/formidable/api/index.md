# Table of contents

* [index.ts][SourceFile-0]
    * Functions
        * [parseForm][FunctionDeclaration-0]

# index.ts

## Functions

### parseForm

Promisify IncomingForm.parse.

```typescript
function parseForm(form: IncomingForm, ctx: Context<any>): Promise<{ fields: Fields; files: Files; }>;
```

**Parameters**

| Name | Type         | Description                  |
| ---- | ------------ | ---------------------------- |
| form | IncomingForm | - The IncomingForm instance. |
| ctx  | Context<any> | - The Context instance.      |

**Return type**

Promise<{ fields: Fields; files: Files; }>

[SourceFile-0]: index.md#indexts
[FunctionDeclaration-0]: index.md#parseform