// FoalTS
import { FileSystem } from '../../file-system';

export async function upgrade(version?: string): Promise<void> {
  // Temp
  version ??= '0.0.0';

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
}