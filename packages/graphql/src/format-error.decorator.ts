import { formatError } from './format-error';
import { maskAndLogError } from './mask-and-log-error';

/**
 * Catch errors rejected and thrown to reject a new one.
 *
 * `FormatError` is a method decorator that replaces the method with a new function wrapping it.
 *
 * @export
 * @param {(err: any) => any} [formatFunction=maskAndLogError] - The function that converts the error.
 * @returns {(target, methodName, descriptor) => any}
 */
export function FormatError(formatFunction: (err: any) => any = maskAndLogError):
    (target: any, methodName: string, descriptor: PropertyDescriptor) => any {
  return (target, methodName, descriptor) => {
    descriptor.value = formatError(descriptor.value, formatFunction);
    return descriptor;
  };
}
