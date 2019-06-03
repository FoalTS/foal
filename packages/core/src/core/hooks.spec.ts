// std
import { deepStrictEqual, strictEqual } from 'assert';

// 3p
import 'reflect-metadata';

// FoalTS
import { getHookFunction, getHookFunctions, Hook, HookFunction, MergeHooks } from './hooks';

describe('Hook', () => {

  const hook1: HookFunction = () => { return; };
  const hook2: HookFunction = () => undefined;
  const hook3: HookFunction = () => undefined;

  it('should add the hook to the metadata hooks on the method class.', () => {
    class Foobar {
      @Hook(hook1)
      @Hook(hook2)
      barfoo() {}
    }

    const actual = Reflect.getOwnMetadata('hooks', Foobar.prototype, 'barfoo');
    deepStrictEqual(actual, [ hook1, hook2 ]);
  });

  it('should add the hooks to the metadata hooks on the method class.', () => {
    class Foobar {
      @Hook(hook1, hook2, hook3)
      barfoo() {}
    }

    const actual = Reflect.getOwnMetadata('hooks', Foobar.prototype, 'barfoo');
    deepStrictEqual(actual, [ hook1, hook2, hook3 ]);
  });

  it('should add the hook to the metadata hooks on the class.', () => {
    @Hook(hook1)
    @Hook(hook2)
    class Foobar {}

    const actual = Reflect.getOwnMetadata('hooks', Foobar);
    deepStrictEqual(actual, [ hook1, hook2 ]);
  });

  it('should add the hooks to the metadata hooks on the method class.', () => {
    @Hook(hook1, hook2, hook3)
    class Foobar {
      barfoo() {}
    }

    const actual = Reflect.getOwnMetadata('hooks', Foobar);
    deepStrictEqual(actual, [ hook1, hook2, hook3 ]);
  });

});

describe('getHookFunction', () => {

  it('should take a hook decorator and return its hook function.', () => {
    const hookFunction = () => {};
    const hook = Hook(hookFunction);

    strictEqual(getHookFunction(hook), hookFunction);
  });

});

describe('getHookFunctions', () => {

  it('should take a hook decorator and return its hook functions.', () => {
    const hookFunction = () => {};
    const hookFunction2 = () => {};
    const hookFunction3 = () => {};
    const hook = Hook(hookFunction, hookFunction2, hookFunction3);

    deepStrictEqual(
      getHookFunctions(hook),
      [ hookFunction, hookFunction2, hookFunction3 ]
    );
  });

});

describe('MergeHooks', () => {

  const hook1: HookFunction = () => { return; };
  const hook2: HookFunction = () => undefined;
  const hook3: HookFunction = () => undefined;
  const hook4: HookFunction = () => undefined;

  it('should create a new hook decorator from the hook functions of the given decorators.', () => {
    @MergeHooks(
      Hook(hook1),
      Hook(hook2, hook3),
      Hook(hook4),
    )
    class Foobar {
      barfoo() {}
    }

    const actual = Reflect.getOwnMetadata('hooks', Foobar);
    deepStrictEqual(actual, [ hook1, hook2, hook3, hook4 ]);
  });

});
