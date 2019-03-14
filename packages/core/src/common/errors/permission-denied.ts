/**
 * Represent the prohibition to perform an action that was expected to be accessible.
 *
 * @export
 * @class PermissionDenied
 * @extends {Error}
 */
export class PermissionDenied extends Error {
  readonly isPermissionDenied = true;

  constructor(public content?: any) {
    super();
    Object.setPrototypeOf(this, PermissionDenied.prototype);
  }
}

/**
 * Check if an error is an instance of PermissionDenied.
 *
 * This function is a help when you have several packages using @foal/core.
 * Npm can install the package several times, which leads to duplicate class
 * definitions. If this is the case, the keyword `instanceof` may return false
 * while the object is an instance of the class. This function fixes this
 * problem.
 *
 * @export
 * @param {object} err - The error to check.
 * @returns {err is PermissionDenied} True if the error is an instance of PermissionDenied. False otherwise.
 */
export function isPermissionDenied(err: object): err is PermissionDenied {
  return err instanceof PermissionDenied || (err as any).isPermissionDenied === true;
}
