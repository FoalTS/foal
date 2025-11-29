import { deepStrictEqual } from 'assert';
import { Generator } from '../../services';
import { UpgradeCommandService } from './upgrade-command.service';

describe('UpgradeCommandService', () => {

  const generator = new Generator();
  let service: UpgradeCommandService;

  beforeEach(() => {
    generator.setUp();
    const generator2 = new Generator();
    service = new UpgradeCommandService(generator2);
  });

  afterEach(() => generator.tearDown());

  context('given a version is provided', () => {
    it('should upgrade all @foal/* dependencies (and NOT the other dependencies) to the given version.', async () => {
      generator
        .copyFixture('upgrade/package.json', 'package.json')

      await service.run({ version: '3.0.0' });

      const actualDependencies = generator.getProjectDependencies();
      const expectedDependencies = [
        { name: '@foal/core', version: '3.0.0' },
        { name: '@foal/foobar', version: '3.0.0' },
        { name: 'another-dependency', version: '^1.0.0' }
      ];
      deepStrictEqual(actualDependencies, expectedDependencies);
    });

    it('should upgrade all @foal/* dev dependencies (and NOT the other dev dependencies) to the given version.', async () => {
      generator
        .copyFixture('upgrade/package.json', 'package.json')

        await service.run({ version: '3.0.0' });

        const actualDevDependencies = generator.getProjectDevDependencies();
        const expectedDevDependencies = [
          { name: '@foal/cli', version: '3.0.0' },
          { name: 'another-dependency2', version: '^2.0.0' }
        ];
        deepStrictEqual(actualDevDependencies, expectedDevDependencies);
      });
  });

  context('given no version is provided', () => {
    it('should upgrade all @foal/* dependencies (and NOT the other dependencies) to the latest version.', async () => {
      generator
        .copyFixture('upgrade/package.json', 'package.json')

      await service.run({}, { getLatestVersion: async () => '3.0.0' });

      const actualDependencies = generator.getProjectDependencies();
      const expectedDependencies = [
        { name: '@foal/core', version: '3.0.0' },
        { name: '@foal/foobar', version: '3.0.0' },
        { name: 'another-dependency', version: '^1.0.0' }
      ];
      deepStrictEqual(actualDependencies, expectedDependencies);
    });

    it('should upgrade all @foal/* dev dependencies (and NOT the other dev dependencies) to the latest version.', async () => {
      generator
        .copyFixture('upgrade/package.json', 'package.json')

        await service.run({}, { getLatestVersion: async () => '3.0.0' });

        const actualDevDependencies = generator.getProjectDevDependencies();
        const expectedDevDependencies = [
          { name: '@foal/cli', version: '3.0.0' },
          { name: 'another-dependency2', version: '^2.0.0' }
        ];
        deepStrictEqual(actualDevDependencies, expectedDevDependencies);
      });
  });

});

