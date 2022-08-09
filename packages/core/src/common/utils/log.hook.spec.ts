// std
import { strictEqual } from 'assert';

// FoalTS
import { Context, getHookFunction, ServiceManager } from '../../core';
import { Log } from './log.hook';

describe('Log', () => {

  let logFn: (message?: any, ...optionalParams: any[]) => void;
  let msgs: any[];

  beforeEach(() => {
    msgs = [];
    logFn = (...args) => msgs.push(args);
  });

  it('should log the message.', () => {
    const hook = getHookFunction(Log('foo', { logFn }));

    const ctx = new Context({});
    hook(ctx, new ServiceManager());

    strictEqual(msgs.length, 1);
    strictEqual(msgs[0][0], 'foo');
  });

  it('should log the request body if options.body = true.', () => {
    const hook = getHookFunction(Log('foo', { body: true, logFn }));

    const body = { foo: 'bar' };
    const ctx = new Context({ body });
    hook(ctx, new ServiceManager());

    strictEqual(msgs.length, 2);
    strictEqual(msgs[1][0], 'Body: ');
    strictEqual(msgs[1][1], body);
  });

  it('should log the request params if options.params = true.', () => {
    const hook = getHookFunction(Log('foo', { params: true, logFn }));

    const params = { foo: 'bar' };
    const ctx = new Context({ params });
    hook(ctx, new ServiceManager());

    strictEqual(msgs.length, 2);
    strictEqual(msgs[1][0], 'Params: ');
    strictEqual(msgs[1][1], params);
  });

  it('should log the request query if options.query = true.', () => {
    const hook = getHookFunction(Log('foo', { query: true, logFn }));

    const query = { foo: 'bar' };
    const ctx = new Context({ query });
    hook(ctx, new ServiceManager());

    strictEqual(msgs.length, 2);
    strictEqual(msgs[1][0], 'Query: ');
    strictEqual(msgs[1][1], query);
  });

  it('should log the request headers if options.headers is a string array.', () => {
    const hook = getHookFunction(Log('foo', { headers: [ 'my-header1', 'my-header2' ], logFn }));

    const headers = {
      // According to RFC 7230, each header field consists of a case-INsensitive field name.
      'My-header2': 'header 2',
      'my-header1': 'header 1',
      'my-header3': 'header 3'
    };
    const ctx = new Context({ headers });
    hook(ctx, new ServiceManager());

    strictEqual(msgs.length, 3);
    strictEqual(msgs[1][0], 'my-header1: ');
    strictEqual(msgs[1][1], 'header 1');
    strictEqual(msgs[2][0], 'my-header2: ');
    // Test the case
    strictEqual(msgs[2][1], 'header 2');
  });

  it('should log all the request headers if options.headers = true.', () => {
    const hook = getHookFunction(Log('foo', { headers: true, logFn }));

    const headers = {
      'my-header1': 'header 1',
      'my-header2': 'header 2',
      'my-header3': 'header 3'
    };
    const ctx = new Context({ headers });
    hook(ctx, new ServiceManager());

    strictEqual(msgs.length, 2);
    strictEqual(msgs[1][0], 'Headers: ');
    strictEqual(msgs[1][1], headers);
  });

});
