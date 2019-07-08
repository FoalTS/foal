// 3p
import { createConnection, getManager } from '@foal/typeorm/node_modules/typeorm';

// App
import { Permission, User } from '../app/entities';

export async function main() {
  await createConnection(require('../../ormconfig.json'));

  const user = new User();
  user.email = 'john@foalts.org';
  await user.setPassword('password');

  const user2 = new User();
  user2.email = 'mary@foalts.org';
  await user2.setPassword('password2');

  const permission = new Permission();
  permission.name = 'Admin permission';
  permission.codeName = 'admin';

  user.userPermissions = [ permission ];

  console.log(
    await getManager().save([ permission, user, user2 ])
  );
}
