// FoalTS
import { maskAndLogErrors } from './mask-and-log-errors';

export function formatError<R>(
  resolver: (...args) => R, formatFunction: (err: any) => any = maskAndLogErrors
): (...args) => Promise<R> {
  return async (...args) => {
    try {
      return await resolver(...args);
    } catch (error) {
      throw await formatFunction(error);
    }
  };
}
