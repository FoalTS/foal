// std
import { existsSync, readdirSync, rmdirSync, statSync, unlinkSync } from 'fs';
import { join } from 'path';

export function rmDirAndFilesIfExist(path: string) {
  if (!existsSync(path)) {
    return;
  }

  const files = readdirSync(path);
  for (const file of files) {
    const stats = statSync(join(path, file));

    if (stats.isDirectory()) {
      rmDirAndFilesIfExist(join(path, file));
    } else {
      unlinkSync(join(path, file));
    }
  }

  rmdirSync(path);
}
