export class Context<User = any> {
  state: { [key: string]: any } = {};
  user: User;

  constructor(public request) {}
}
