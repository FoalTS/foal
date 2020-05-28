
// FoalTS
import { FileSystem } from '../../file-system';
import { getNames } from '../../utils';

export function createSubApp({ name }: { name: string }) {
  const fs = new FileSystem();
  (fs as any).testDir = '';

  let root = '';
  if (fs.exists('src/app')) {
    fs
      .ensureDir('src/app/sub-apps')
      .ensureFile('src/app/sub-apps/index.ts');
    root = 'src/app/sub-apps';
  } else if (fs.exists('sub-apps')) {
    root = 'sub-apps';
  }

  const names = getNames(name);

  fs
    .cd(root)
    .ensureDir(names.kebabName)
    .addNamedExportIn('index.ts', `${names.upperFirstCamelName}Controller`, `./${names.kebabName}`)
      .cd(names.kebabName)
      .render('sub-app/index.ts', 'index.ts', names)
      .render('sub-app/controller.ts', `${names.kebabName}.controller.ts`, names)
        // Controllers
        .ensureDir('controllers')
        .cd('controllers')
        .copy('sub-app/controllers/index.ts', 'index.ts')
        .cd('..')
        // Hooks
        .ensureDir('hooks')
        .cd('hooks')
        .copy('sub-app/hooks/index.ts', 'index.ts')
        .cd('..')
        // Entities
        .ensureDir('entities')
        .cd('entities')
        .copy('sub-app/entities/index.ts', 'index.ts')
        .cd('..')
        // Services
        .ensureDir('services')
        .cd('services')
        .copy('sub-app/services/index.ts', 'index.ts');
}
