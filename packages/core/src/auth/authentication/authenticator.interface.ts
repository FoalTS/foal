export interface IAuthenticator<User = any> {
  authenticate(credentials: any): User | null | Promise<User|null>;
}
