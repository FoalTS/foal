export interface IUserWithPermissions {
  hasPerm(codeName: string): boolean;
}