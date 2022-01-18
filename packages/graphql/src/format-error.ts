// FoalTS
import { maskAndLogError } from './mask-and-log-error';

/**
 * Catch errors rejected and thrown to reject a new one.
 *
 * `formatError` creates a new function by wrapping the given one.
 *
 * @export
 * @template F
 * @param {F} resolver - The resolver function that throws or rejects the error.
 * @param {(err: any) => any} [formatFunction=maskAndLogError] - The function that converts the error.
 * @returns {(...args: Parameters<F>) => Promise<ReturnType<F>>} The new function.
 */
export function formatError<F extends (...args: any[]) => any>(
  resolver: F, formatFunction: (err: any) => any = maskAndLogError
): (...args: Parameters<F>) => Promise<ReturnType<F>> {
  return async (...args) => {
    try {
      return await resolver(...args);
    } catch (error: any) {
      throw await formatFunction(error);
    }
  };
}
