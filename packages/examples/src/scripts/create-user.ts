// App
import { Permission, User } from '../app/entities';
import { createDataSource } from '../data-source';

export async function main() {
  const dataSource = createDataSource();
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
