// 3p
import { expect } from 'chai';

// FoalTS
import { Controller } from '../../core';
import { getMetadata } from '../../core/routes/utils';
import { controller } from './controller.util';

describe('controller util', () => {

  it('should return the given controller class.', () => {
    @Controller()
    class Foobar {}

    expect(controller('', Foobar)).to.equal(Foobar);
  });

  it('should define the metadata path={path} of the controller class.', () => {
    @Controller()
    class Foobar {}

    controller('/foo', Foobar);

    expect(getMetadata('path', Foobar)).to.equal('/foo');
  });

});
