import { ObjectDoesNotExist } from '@foal/core';
import { expect } from 'chai';

import { <%= CamelName %> } from './<%= kebabName %>.service';

describe('<%= CamelName %>', () => {

  let service: <%= CamelName %>;

  it('should instantiate.', () => {
    service = new <%= CamelName %>();
  });

  describe('when validate is called', () => {

    it('should throw a ValidationError if the credential format is incorrect.', () => {

    });

    it('should return the credentials if their format is correct.', () => {

    });

  });

  describe('when authenticate is called', () => {

    it('should return null if the credentials are incorrect.', async () => {
      const user = await service.authenticate({ /* credentials */ });
      expect(user).to.equal(null);
    });

    it('should return the authenticated user if the given credentials are correct.', async () => {
      const user = await service.authenticate({ /* credentials */ });
      expect(user).to.deep.equal({ /* The expected user */});
    });

  });

});
