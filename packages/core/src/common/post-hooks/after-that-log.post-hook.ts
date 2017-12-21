import {
  Context,
  postHook,
  PostMiddleware
} from '../../index';

export function makeAfterThatLogMiddleware(message: string): PostMiddleware {
  return function afterThatlogMiddleware(ctx: Context): void {
    console.log(message);
  };
}

export function afterThatLog(message: string) {
  return postHook(makeAfterThatLogMiddleware(message));
}
