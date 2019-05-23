import { formatError } from './format-error';
import { maskAndLogErrors } from './mask-and-log-errors';

export function FormatError(formatFunction: (err: any) => any = maskAndLogErrors):
    (target, methodName, descriptor) => any {
  return (target, methodName, descriptor) => {
    descriptor.value = formatError(descriptor.value, formatFunction);
    return descriptor;
  };
}
