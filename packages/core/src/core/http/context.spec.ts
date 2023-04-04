// std
import { deepStrictEqual, strictEqual } from 'assert';

// FoalTS
import { FileList } from '../../common/file';
import { Context } from './context';

describe('Context', () => {

  it('should instantiate with suitable properties.', () => {
    const request = {};
    const actual = new Context(request);

    strictEqual(actual.request, request);
    deepStrictEqual(actual.state, {});
    strictEqual(actual.user, null);
    strictEqual(actual.session, null);
    strictEqual(actual.files instanceof FileList, true);
    strictEqual(actual.controllerName, '');
    strictEqual(actual.controllerMethodName, '');

    const actual2 = new Context(request, 'AppController', 'foobar');
    strictEqual(actual2.controllerName, 'AppController');
    strictEqual(actual2.controllerMethodName, 'foobar');
  });

});
