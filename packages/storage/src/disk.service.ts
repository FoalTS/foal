// std
import { Readable } from 'stream';

// 3p
import { Class, Config, dependency, ServiceManager } from '@foal/core';

// FoalTS
import { AbstractDisk } from './abstract-disk.service';
import { LocalDisk } from './local-disk.service';

type Type<C extends 'buffer'|'stream'> =
  C extends 'buffer' ? Buffer :
  C extends 'stream' ? Readable :
  never;

/**
 * File storage.
 *
 * This disk looks at the value of the configuration key "settings.disk.driver"
 * to know which disk to use (LocalDisk, S3Disk, etc).
 *
 * @export
 * @class Disk
 * @extends {AbstractDisk}
 */
export class Disk extends AbstractDisk {

  @dependency
  services: ServiceManager;

  write(
    dirname: string,
    content: Buffer|Readable,
    options?: { name?: string } | { extension?: string },
  ): Promise<{ path: string }> {
    return this.getDriverDisk().write(dirname, content, options);
  }

  read<C extends 'buffer'|'stream'>(path: string, content: C): Promise<{
    file: Type<C>;
    size: number;
  }> {
    return this.getDriverDisk().read(path, content);
  }

  delete(path: string): Promise<void> {
    return this.getDriverDisk().delete(path);
  }

  private getDriverDisk(): AbstractDisk {
    const driver = Config.getOrThrow(
      'settings.disk.driver',
      'string',
      'You must provide a driver name when using file storage (Disk).'
    );

    if (driver === 'local') {
      return this.services.get(LocalDisk);
    }

    const { ConcreteDisk } = require(driver) as { ConcreteDisk: Class<AbstractDisk>|undefined };
    if (!ConcreteDisk) {
      throw new Error(`"${driver}" is not a valid driver. Cannot find the "ConcreteClass" export.`);
    }
    return this.services.get(ConcreteDisk);
  }

}
