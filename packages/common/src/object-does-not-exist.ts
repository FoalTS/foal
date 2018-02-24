export class ObjectDoesNotExist extends Error {
  constructor() {
    super();
    Object.setPrototypeOf(this, ObjectDoesNotExist.prototype);
  }
}
