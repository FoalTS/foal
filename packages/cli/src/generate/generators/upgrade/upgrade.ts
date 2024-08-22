// FoalTS
import { FileSystem } from '../../file-system';
import { installDependencies, logger } from '../../utils';

async function getLatestVersion(): Promise<string> {
  const response = await fetch('https://registry.npmjs.org/@foal/core/latest');
  const { version } = await response.json();
  return version;
}

export async function upgrade(
  { version, autoInstall }: { version?: string, autoInstall?: boolean },
  options: { getLatestVersion: typeof getLatestVersion } = { getLatestVersion }
): Promise<void> {
  version ??= await options.getLatestVersion();

  logger.log();
  logger.log(`  Upgrading @foal/* dependencies to version ${version}...`);
  logger.log();

  const fs = new FileSystem();

  const dependencies = fs.getProjectDependencies();
  for (const dependency of dependencies) {
    if (dependency.name.startsWith('@foal/')) {
      fs.setOrUpdateProjectDependency(dependency.name, version);
    }
  }

  const devDependencies = fs.getProjectDevDependencies();
  for (const devDependency of devDependencies) {
    if (devDependency.name.startsWith('@foal/')) {
      fs.setOrUpdateProjectDevDependency(devDependency.name, version);
    }
  }

  if (autoInstall) {
    await installDependencies();
    logger.log();
  }
}