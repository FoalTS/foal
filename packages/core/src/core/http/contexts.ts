import { UserWithPermissions } from '../../auth';

export class Context<User extends UserWithPermissions = UserWithPermissions> {
  state: { [key: string]: any } = {};
  user: User|undefined = undefined;

  constructor(public request) {}
}
