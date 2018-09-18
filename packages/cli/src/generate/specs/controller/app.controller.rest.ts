// 3p
import {} from 'somewhere';
import { TestFooBarController } from './controllers';

export class MyModule {
  controllers = [
    controller('/test-foo-bars', TestFooBarController)
  ];
}
