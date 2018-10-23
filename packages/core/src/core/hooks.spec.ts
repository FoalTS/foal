// std
import { deepStrictEqual, strictEqual } from 'assert';

// 3p
import 'reflect-metadata';

// FoalTS
import { getHookFunction, Hook, HookFunction } from './hooks';

describe('Hook', () => {

  const hook1: HookFunction = () => { return; };
  const hook2: HookFunction = () => undefined;

  it('should add the hook to the metadata hooks on the method class.', () => {
    class Foobar {
      @Hook(hook1)
      @Hook(hook2)
      barfoo() {}
    }

    const actual = Reflect.getOwnMetadata('hooks', Foobar.prototype, 'barfoo');
    deepStrictEqual(actual, [ hook1, hook2 ]);
  });

  it('should add the hook to the metadata hooks on the class.', () => {
    @Hook(hook1)
    @Hook(hook2)
    class Foobar {}

    const actual = Reflect.getOwnMetadata('hooks', Foobar);
    deepStrictEqual(actual, [ hook1, hook2 ]);
  });

});

describe('getHookFunction', () => {

  it('should take a hook decorator and return its hook function.', () => {
    const hookFunction = () => {};
    const hook = Hook(hookFunction);

    strictEqual(getHookFunction(hook), hookFunction);
  });

});
