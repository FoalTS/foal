import {
  MethodNotAllowedError,
  preHook,
} from '@foal/core';

export function methodNotAllowed() {
  return preHook(() => {
    throw new MethodNotAllowedError();
  });
}
