import { deepStrictEqual, strictEqual } from 'assert';
import { createNotifierMessage, getCoreDependency } from './utils';

describe('getCoreDependency', () => {
  it('should return the core dependency', () => {
    const dependencies = [
      { name: '@foal/typeorm', version: '1.0.0' },
      { name: '@foal/core', version: '1.0.0' },
    ];

    deepStrictEqual(getCoreDependency(dependencies), { name: '@foal/core', version: '1.0.0' });
  });
});

describe('createNotifierMessage', () => {
  it('should return the correct message.', () => {
    const dependencies = [
      { name: '@foal/typeorm', version: '1.0.0' },
      { name: '@foal/core', version: '2.0.0' },
      { name: 'another-dependency', version: '3.0.0' },
    ];
    const devDependencies = [
      { name: '@foal/cli', version: '4.0.0' },
    ];
    const version = '6.0.0';

    strictEqual(
      createNotifierMessage(dependencies, devDependencies, version),
      'Run `npm install @foal/typeorm@6.0.0 @foal/core@6.0.0 @foal/cli@6.0.0` to update.'
    );
  });
});