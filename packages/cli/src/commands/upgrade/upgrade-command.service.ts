// FoalTS
import { Generator } from '../../services';
import { installDependencies, logger } from '../generators/utils';

async function getLatestVersion(): Promise<string> {
  const response = await fetch('https://registry.npmjs.org/@foal/core/latest');
  const { version } = await response.json();
  return version;
}

/**
 * Service for upgrading FoalTS dependencies.
 */
export class UpgradeCommandService {
  constructor(
    private generator: Generator,
  ) {}

  /**
   * Upgrade all @foal/* dependencies to the specified version (or latest if not specified).
   *
   * @param {string} version - Optional specific version to upgrade to
   * @param {boolean} autoInstall - Whether to automatically install dependencies
   * @param {() => Promise<string>} getLatestVersionFn - Optional function to get latest version (for testing)
   * @returns {Promise<void>}
   */
  async run(
    { version, autoInstall }: { version?: string, autoInstall?: boolean },
    options: { getLatestVersion: typeof getLatestVersion } = { getLatestVersion }
  ): Promise<void> {
    version ??= await options.getLatestVersion();

    logger.log();
    logger.log(`  Upgrading @foal/* dependencies to version ${version}...`);
    logger.log();

    const dependencies = this.generator.getProjectDependencies();
    for (const dependency of dependencies) {
      if (dependency.name.startsWith('@foal/')) {
        this.generator.setOrUpdateProjectDependency(dependency.name, version);
      }
    }

    const devDependencies = this.generator.getProjectDevDependencies();
    for (const devDependency of devDependencies) {
      if (devDependency.name.startsWith('@foal/')) {
        this.generator.setOrUpdateProjectDevDependency(devDependency.name, version);
      }
    }

    if (autoInstall) {
      await installDependencies();
      logger.log();
    }
  }
}

