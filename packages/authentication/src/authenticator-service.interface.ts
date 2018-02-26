export interface AuthenticatorService<User> {
  authenticate(credentials: any): User | null | Promise<User|null>;
}
