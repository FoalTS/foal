// FoalTS
import { maskAndLogError } from './mask-and-log-error';

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
