// std
import { deepStrictEqual, strictEqual } from 'assert';

// 3p
import 'reflect-metadata';

// FoalTS
import { Config } from './config';
import { getHookFunction, getHookFunctions, Hook, HookFunction, MergeHooks } from './hooks';
import { ApiUseTag, getApiUsedTags } from './openapi';

describe('Hook', () => {

  const hook1: HookFunction = () => { return; };
  const hook2: HookFunction = () => undefined;

  afterEach(() => Config.remove('settings.openapi.useHooks'));

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

  it(
    'should apply the OpenAPI decorators if options.openapi is undefined and settings.openapi.useHooks is undefined.',
    () => {
      class Foobar {
        @Hook(hook1, [
          ApiUseTag('tag1'),
          ApiUseTag('tag2')
        ])
        barfoo() {}
      }

      const actual = getApiUsedTags(Foobar, 'barfoo');
      deepStrictEqual(actual, [ 'tag1', 'tag2' ]);
    }
  );

  it(
    'should apply the OpenAPI decorators if options.openapi is undefined and settings.openapi.useHooks is true.',
    () => {
      Config.set('settings.openapi.useHooks', true);

      class Foobar {
        @Hook(hook1, [
          ApiUseTag('tag1'),
          ApiUseTag('tag2')
        ])
        barfoo() {}
      }

      const actual = getApiUsedTags(Foobar, 'barfoo');
      deepStrictEqual(actual, [ 'tag1', 'tag2' ]);
    }
  );

  it(
    'should NOT apply the OpenAPI decorators if options.openapi is undefined and settings.openapi.useHooks is false.',
    () => {
      Config.set('settings.openapi.useHooks', false);

      class Foobar {
        @Hook(hook1, [
          ApiUseTag('tag1'),
          ApiUseTag('tag2')
        ])
        barfoo() {}
      }

      const actual = getApiUsedTags(Foobar, 'barfoo');
      deepStrictEqual(actual, undefined);
    }
  );

  it(
    'should apply the OpenAPI decorators if options.openapi is true and settings.openapi.useHooks is undefined.',
    () => {
      class Foobar {
        @Hook(hook1, [
          ApiUseTag('tag1'),
          ApiUseTag('tag2')
        ], { openapi: true })
        barfoo() {}
      }

      const actual = getApiUsedTags(Foobar, 'barfoo');
      deepStrictEqual(actual, [ 'tag1', 'tag2' ]);
    }
  );

  it(
    'should apply the OpenAPI decorators if options.openapi is true and settings.openapi.useHooks is true.',
    () => {
      Config.set('settings.openapi.useHooks', true);

      class Foobar {
        @Hook(hook1, [
          ApiUseTag('tag1'),
          ApiUseTag('tag2')
        ], { openapi: true })
        barfoo() {}
      }

      const actual = getApiUsedTags(Foobar, 'barfoo');
      deepStrictEqual(actual, [ 'tag1', 'tag2' ]);
    }
  );

  it(
    'should apply the OpenAPI decorators if options.openapi is true and settings.openapi.useHooks is false.',
    () => {
      Config.set('settings.openapi.useHooks', false);

      class Foobar {
        @Hook(hook1, [
          ApiUseTag('tag1'),
          ApiUseTag('tag2')
        ], { openapi: true })
        barfoo() {}
      }

      const actual = getApiUsedTags(Foobar, 'barfoo');
      deepStrictEqual(actual, [ 'tag1', 'tag2' ]);
    }
  );

  it(
    'should NOT apply the OpenAPI decorators if options.openapi is false and settings.openapi.useHooks is undefined.',
    () => {
      class Foobar {
        @Hook(hook1, [
          ApiUseTag('tag1'),
          ApiUseTag('tag2')
        ], { openapi: false })
        barfoo() {}
      }

      const actual = getApiUsedTags(Foobar, 'barfoo');
      strictEqual(actual, undefined);
    }
  );

  it(
    'should NOT apply the OpenAPI decorators if options.openapi is false and settings.openapi.useHooks is true.',
    () => {
      Config.set('settings.openapi.useHooks', true);

      class Foobar {
        @Hook(hook1, [
          ApiUseTag('tag1'),
          ApiUseTag('tag2')
        ], { openapi: false })
        barfoo() {}
      }

      const actual = getApiUsedTags(Foobar, 'barfoo');
      strictEqual(actual, undefined);
    }
  );

  it(
    'should NOT apply the OpenAPI decorators if options.openapi is false and settings.openapi.useHooks is false.',
    () => {
      Config.set('settings.openapi.useHooks', false);

      class Foobar {
        @Hook(hook1, [
          ApiUseTag('tag1'),
          ApiUseTag('tag2')
        ], { openapi: false })
        barfoo() {}
      }

      const actual = getApiUsedTags(Foobar, 'barfoo');
      strictEqual(actual, undefined);
    }
  );

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
    const hook = MergeHooks(
      Hook(hookFunction),
      Hook(hookFunction2),
      Hook(hookFunction3),
    );

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

  it('should create a new hook decorator from the hook functions of the given decorators (class).', () => {
    @MergeHooks(
      Hook(hook1),
      Hook(hook2),
      Hook(hook3),
    )
    class Foobar {
      barfoo() {}
    }

    const actual = Reflect.getOwnMetadata('hooks', Foobar);
    deepStrictEqual(actual, [ hook1, hook2, hook3 ]);
  });

  it('should create a new hook decorator from the hook functions of the given decorators (method class).', () => {
    class Foobar {
      @MergeHooks(
        Hook(hook1),
        Hook(hook2),
        Hook(hook3),
      )
      barfoo() {}
    }

    const actual = Reflect.getOwnMetadata('hooks', Foobar.prototype, 'barfoo');
    deepStrictEqual(actual, [ hook1, hook2, hook3 ]);
  });

});
