# @foal/formidable

## Table of contents

* [index.ts](index-2.md#indexts)
  * Functions
    * \[parseForm\]\[FunctionDeclaration-0\]

## index.ts

### Functions

#### parseForm

Promisify IncomingForm.parse.

```typescript
function parseForm(form: IncomingForm, ctx: Context<any>): Promise<{ fields: Fields; files: Files; }>;
```

**Parameters**

| Name | Type | Description |
| :--- | :--- | :--- |
| form | IncomingForm | - The IncomingForm instance. |
| ctx | Context | - The Context instance. |

**Return type**

Promise&lt;{ fields: Fields; files: Files; }&gt;

\[FunctionDeclaration-0\]: index.md\#parseform

