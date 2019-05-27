// FoalTS
import { maskAndLogError } from './mask-and-log-error';

/**
 * Catch errors rejected and thrown to reject a new one.
 *
 * `formatError` creates a new function by wrapping the given one.
 *
 * @export
 * @template R
 * @param {(...args) => R} resolver - The resolver function that throws or rejects the error.
 * @param {(err: any) => any} [formatFunction=maskAndLogError] - The function that converts the error.
 * @returns {(...args) => Promise<R>} - The new function.
 */
export function formatError<R>(
  resolver: (...args) => R, formatFunction: (err: any) => any = maskAndLogError
): (...args) => Promise<R> {
  return async (...args) => {
    try {
      return await resolver(...args);
    } catch (error) {
      throw await formatFunction(error);
    }
  };
}
