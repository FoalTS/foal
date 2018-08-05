// std
import { strictEqual } from 'assert';

// FoalTS
import { Controller } from '../../core';
import { getMetadata } from '../../core/routes/utils';
import { controller } from './controller.util';

describe('controller util', () => {

  it('should return the given controller class.', () => {
    @Controller()
    class Foobar {}

    strictEqual(controller('', Foobar), Foobar);
  });

  it('should define the metadata path={path} of the controller class.', () => {
    @Controller()
    class Foobar {}

    controller('/foo', Foobar);

    strictEqual(getMetadata('path', Foobar), '/foo');
  });

});
