# The Todo Model

Let's create your first model. The CLI provides a useful command to generate a new file with an empty model.

```sh
foal generate model todo
```

> FoalTS uses [Mongoose](http://mongoosejs.com), a complete *Object-Document Mapper*, to communicate with the MongoDB database.

Open the file `todo.model.ts` in the `src/app/models` directory and add a `text` field.

```typescript
import { Document, model, Model, models, Schema } from 'mongoose';

const todoSchema: Schema = new Schema({
  text: {
    required: true,
    type: String // String with a capital letter
  }
});

export interface ITodo extends Document {
  text: string; // string a lowercase letter
}

export const Todo: Model<ITodo> = models.Todo || model<ITodo>('Todo', todoSchema);

```
