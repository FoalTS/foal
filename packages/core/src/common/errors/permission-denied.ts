export class PermissionDenied extends Error {
  readonly isPermissionDenied = true;

  constructor(public content?: any) {
    super();
    Object.setPrototypeOf(this, PermissionDenied.prototype);
  }
}

export function isPermissionDenied(err: object): err is PermissionDenied {
  return err instanceof PermissionDenied || (err as any).isPermissionDenied === true;
}
