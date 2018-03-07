export interface IAuthenticator<User> {
  authenticate(credentials: any): User | null | Promise<User|null>;
}
