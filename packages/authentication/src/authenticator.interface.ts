export interface IAuthenticator<User> {
  checkFormat(credentials: any): any;
  authenticate(credentials: any): User | null | Promise<User|null>;
}
