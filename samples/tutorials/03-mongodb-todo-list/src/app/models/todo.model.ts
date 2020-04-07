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