import { File } from './file';

export class FileList {
  private files: Map<string, File[]> = new Map();

  push(name: string, file: File): void {
    const files = this.files.get(name);

    if (!files) {
      this.files.set(name, [ file ]);
      return;
    }

    files.push(file);
  }

  get(name: string): File[] {
    const files = this.files.get(name);

    if (!files) {
      return [];
    }

    return [ ...files ];
  }

  getAll(): File[] {
    return Array.from(this.files.values()).flat();
  }
}