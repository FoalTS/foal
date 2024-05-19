import { deepStrictEqual, strictEqual } from 'assert';
import { INpmPackage, NodeDependencies } from './node-dependencies';

describe('NodeDependencies', () => {
  let manager: NodeDependencies;
  const npmPackage: INpmPackage = {
    dependencies: {
      '@foal/core': '^4.4.0',
      'foo': '1.1.0',
      'lat': 'latest'
    },
    devDependencies: {
      '@foal/cli': '^4.4.0'
    }
  };

  it('should not affect the original npmPackage object', () => {
    const dependenciesForTest = { ...npmPackage.devDependencies };

    manager = new NodeDependencies(dependenciesForTest);
    manager.setOrUpdate('mocha', '1.0.0', '^', true);

    deepStrictEqual(npmPackage.devDependencies, dependenciesForTest);
  });

  it('should keep the prefix if keepExistingPrefix is true', () => {
    manager = new NodeDependencies(npmPackage.dependencies);
    manager.setOrUpdate('@foal/core', '5.0.0', '', true);

    const result = manager.getDependencies()['@foal/core'];
    const expected = '^5.0.0';

    strictEqual(expected, result);
  });

  it('should override the prefix if keepExistingPrefix is true but the prefix is not supported', () => {
    manager = new NodeDependencies(npmPackage.dependencies);
    manager.setOrUpdate('lat', '5.0.0', '^', true);

    const result = manager.getDependencies().lat;
    const expected = '^5.0.0';

    strictEqual(expected, result);
  });

  it('should override the prefix if keepExistingPrefix is false', () => {
    manager = new NodeDependencies(npmPackage.dependencies);
    manager.setOrUpdate('@foal/core', '5.0.0', '', false);

    const result = manager.getDependencies()['@foal/core'];
    const expected = '5.0.0';

    strictEqual(expected, result);
  });

  it('should use the prefix if the package does not exists', () => {
    manager = new NodeDependencies(npmPackage.dependencies);
    manager.setOrUpdate('@foal/mongodb', '4.4.0', '^', true);
    manager.setOrUpdate('@foal/password', '4.4.0', '^', false);

    const mongoPackage = manager.getDependencies()['@foal/mongodb'];
    const passwordPackage = manager.getDependencies()['@foal/password'];
    const expected = '^4.4.0';

    strictEqual(expected, mongoPackage);
    strictEqual(expected, passwordPackage);
  });
});
