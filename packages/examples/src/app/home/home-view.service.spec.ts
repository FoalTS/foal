import { expect } from 'chai';

import { HomeViewService } from './home-view.service';

describe('HomeViewService', () => {

  let service: HomeViewService;

  it('should instantiate.', () => {
    service = new HomeViewService();
  });

  describe('when render is called', () => {

    xit('should return the rendered template.', async () => {
      const actual = await service.render({});
      const expected = '';

      expect(actual).to.equal(expected);
    });

  });

});
