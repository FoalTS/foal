// std
import { strictEqual } from 'assert';

// FoalTS
import { getMetadata } from '../core/routes/utils';
import { ApiInfo } from './decorators';
import { IApiInfo } from './interfaces';

describe('ApiInfo', () => {
  it('should define the correct metadata.', () => {
    const metadata: IApiInfo = {
      contact: {
        email: 'support@example.com',
        name: 'API Support',
        url: 'http://www.example.com/support',
      },
      description: 'This is a sample server for a pet store.',
      license: {
        name: 'Apache 2.0',
        url: 'http://www.apache.org/licenses/LICENSE-2.0.html'
      },
      termsOfService: 'http://example.com/terms/',
      title: 'Sample Pet Store App',
      version: '1.0.1'
    };

    @ApiInfo(metadata)
    class Controller {}

    strictEqual(getMetadata('api:info', Controller), metadata);
  });
});
