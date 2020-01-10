// 3p
import { Config } from '@foal/core';
import { connect, disconnect } from 'mongoose';

// App
import { Todo } from '../app/models';

export const schema = {
  properties: {
    text: { type: 'string' }
  },
  required: [ 'text' ],
  type: 'object',
};

export async function main(args: { text: string }) {
  // Create a new connection to the database.
  const uri = Config.get<string>('mongodb.uri');
  connect(uri, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true });

  // Create a new task with the text given in the command line.
  const todo = new Todo();
  todo.text = args.text;

  try {
  // Save the task in the database and then display it in the console.
    console.log(
      await todo.save()
    );
  } catch (error) {
    console.log(error.message);
  } finally {
    // Close the connection to the database.
    disconnect();
  }
}
