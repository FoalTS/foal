export class ObjectDoesNotExist extends Error {
  public readonly isObjectDoesNotExist = true;

  constructor() {
    super();
    Object.setPrototypeOf(this, ObjectDoesNotExist.prototype);
  }
}

export function isObjectDoesNotExist(err: object): boolean {
  return err instanceof ObjectDoesNotExist || (err as any).isObjectDoesNotExist === true;
}
