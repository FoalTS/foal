// App
import { Permission, User } from '../app/entities';
import { dataSource  } from '../db';

export async function main() {
  await dataSource.initialize();

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

  console.log(await permission.save());
  console.log(await user.save());
  console.log(await user2.save());
}
