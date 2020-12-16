---
title: The Todo Model
---

Let's create your first model. The CLI provides a useful command to generate a new file with an empty model.

```sh
foal generate model todo
```

> FoalTS uses [Mongoose](http://mongoosejs.com), a complete *Object-Document Mapper*, to communicate with the MongoDB database.

Open the file `todo.model.ts` in the `src/app/models` directory and add a `text` field.

```typescript
import { model, models, Schema } from 'mongoose';

const todoSchema = new Schema({
  text: {
    required: true,
    type: String // String with a capital letter
  }
});

export const Todo = models.Todo || model('Todo', todoSchema);

```
