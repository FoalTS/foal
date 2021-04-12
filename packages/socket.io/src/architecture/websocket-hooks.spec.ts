// std
import { deepStrictEqual, strictEqual } from 'assert';

// 3p
import 'reflect-metadata';

// FoalTS
import {
  getWebsocketHookFunction,
  getWebsocketHookFunctions,
  WebsocketHook,
  WebsocketHookFunction,
  MergeWebsocketHooks
} from './websocket-hooks';

describe('WebsocketHook', () => {

  const hook1: WebsocketHookFunction = () => { return; };
  const hook2: WebsocketHookFunction = () => undefined;

  it('should add the hook to the metadata websocket hooks on the method class.', () => {
    class Foobar {
      @WebsocketHook(hook1)
      @WebsocketHook(hook2)
      barfoo() {}
    }

    const actual = Reflect.getOwnMetadata('websocket-hooks', Foobar.prototype, 'barfoo');
    deepStrictEqual(actual, [ hook1, hook2 ]);
  });

  it('should add the hook to the metadata websocket hooks on the class.', () => {
    @WebsocketHook(hook1)
    @WebsocketHook(hook2)
    class Foobar {}

    const actual = Reflect.getOwnMetadata('websocket-hooks', Foobar);
    deepStrictEqual(actual, [ hook1, hook2 ]);
  });

});

describe('getWebsocketHookFunction', () => {

  it('should take a websocket hook decorator and return its hook function.', () => {
    const hookFunction = () => {};
    const hook = WebsocketHook(hookFunction);

    strictEqual(getWebsocketHookFunction(hook), hookFunction);
  });

});


describe('getWebsocketHookFunctions', () => {

  it('should take a websocket hook decorator and return its hook functions.', () => {
    const hookFunction = () => {};
    const hookFunction2 = () => {};
    const hookFunction3 = () => {};
    const hook = MergeWebsocketHooks(
      WebsocketHook(hookFunction),
      WebsocketHook(hookFunction2),
      WebsocketHook(hookFunction3),
    );

    deepStrictEqual(
      getWebsocketHookFunctions(hook),
      [ hookFunction, hookFunction2, hookFunction3 ]
    );
  });

});

describe('MergeWebsocketHooks', () => {

  const hook1: WebsocketHookFunction = () => { return; };
  const hook2: WebsocketHookFunction = () => undefined;
  const hook3: WebsocketHookFunction = () => undefined;

  it('should create a new websocket hook decorator from the hook functions of the given decorators (class).', () => {
    @MergeWebsocketHooks(
      WebsocketHook(hook1),
      WebsocketHook(hook2),
      WebsocketHook(hook3),
    )
    class Foobar {
      barfoo() {}
    }

    const actual = Reflect.getOwnMetadata('websocket-hooks', Foobar);
    deepStrictEqual(actual, [ hook1, hook2, hook3 ]);
  });

  it('should create a new websocket hook decorator from the hook functions of the given decorators (method class).', () => {
    class Foobar {
      @MergeWebsocketHooks(
        WebsocketHook(hook1),
        WebsocketHook(hook2),
        WebsocketHook(hook3),
      )
      barfoo() {}
    }

    const actual = Reflect.getOwnMetadata('websocket-hooks', Foobar.prototype, 'barfoo');
    deepStrictEqual(actual, [ hook1, hook2, hook3 ]);
  });

});