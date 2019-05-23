import { formatError } from './format-error';
import { maskAndLogError } from './mask-and-log-error';

export function FormatError(formatFunction: (err: any) => any = maskAndLogError):
    (target, methodName, descriptor) => any {
  return (target, methodName, descriptor) => {
    descriptor.value = formatError(descriptor.value, formatFunction);
    return descriptor;
  };
}
