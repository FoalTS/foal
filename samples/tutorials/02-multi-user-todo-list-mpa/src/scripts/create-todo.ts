// 3p
import { createConnection } from 'typeorm';

// App
import { Todo, User } from '../app/entities';

export const schema = {
  properties: {
    owner: { type: 'string', format: 'email' },
    text: { type: 'string' },
  },
  required: [ 'owner', 'text' ],
  type: 'object',
};

export async function main(args) {
  const connection = await createConnection();

  const user = await connection.getRepository(User).findOne({ email: args.owner });

  if (!user) {
    console.log('No user was found with the email ' + args.owner);
    return;
  }

  const todo = new Todo();
  todo.text = args.text;
  todo.owner = user;

  console.log(
    await connection.manager.save(todo)
  );

  await connection.close();
}
