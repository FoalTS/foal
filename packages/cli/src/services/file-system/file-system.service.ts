import { copyFileSync, existsSync, mkdirSync, readFileSync, rmSync, unlinkSync, writeFileSync, readdirSync } from 'fs';
import { join } from 'path';

export class FileSystemService {

  private readonly testDir = 'test-generators/subdir';

  private isTestingEnvironment(): boolean {
    return process.env.P1Z7kEbSUUPMxF8GqPwD8Gx_FOAL_CLI_TEST === 'true';
  }

  setUp(): void {
    if (!this.isTestingEnvironment()) {
      throw new Error('Impossible to create the test directory in a non-testing environment.');
    }

    mkdirSync(this.testDir, { recursive: true });
  }

  tearDown(): void {
    if (!this.isTestingEnvironment()) {
      throw new Error('Impossible to remove the test directory in a non-testing environment.');
    }

    const [ firstDir ] = this.testDir.split('/');

    rmSync(firstDir, { recursive: true, force: true });
  }

  computePath(path: string): string {
    if (!this.isTestingEnvironment()) {
      return path;
    }

    if (!existsSync(this.testDir)) {
      throw new Error('The testing environment is not set up.');
    }

    return join(this.testDir, path);
  }

  mkdir(path: string): void {
    mkdirSync(this.computePath(path), { recursive: true });
  }

  rmdir(path: string): void {
    rmSync(this.computePath(path), { recursive: true });
  }

  writeFile(path: string, content: string): void {
    writeFileSync(this.computePath(path), content, 'utf8');
  }

  readFile(path: string): string {
    return readFileSync(this.computePath(path), 'utf8');
  }

  readBinaryFile(path: string): Buffer {
    return readFileSync(this.computePath(path));
  }

  readFileFromTemplates(path: string): string {
    return readFileSync(join(__dirname, '../../..', 'templates', path), 'utf8');
  }

  readFileFromSpecs(path: string): string {
    return readFileSync(join(__dirname, '../../..', 'specs', path), 'utf8');
  }

  readBinaryFileFromSpecs(path: string): Buffer {
    return readFileSync(join(__dirname, '../../..', 'specs', path));
  }

  deleteFile(path: string): void {
    unlinkSync(this.computePath(path));
  }

  copyFile(src: string, dest: string): void {
    copyFileSync(this.computePath(src), this.computePath(dest));
  }

  copyFileFromTemplates(src: string, dest: string): void {
    copyFileSync(join(__dirname, '../../..', 'templates', src), this.computePath(dest));
  }

  copyFileFromFixtures(src: string, dest: string): void {
    copyFileSync(join(__dirname, '../../..', 'fixtures', src), this.computePath(dest));
  }

  exists(path: string): boolean {
    return existsSync(this.computePath(path));
  }

  existsTemplate(path: string): boolean {
    return existsSync(join(__dirname, '../../..', 'templates', path));
  }

  existsFixture(path: string): boolean {
    return existsSync(join(__dirname, '../../..', 'fixtures', path));
  }

  existsSpec(path: string): boolean {
    return existsSync(join(__dirname, '../../..', 'specs', path));
  }

  isDirectoryEmpty(path: string): boolean {
    const dirPath = this.computePath(path);

    if (!existsSync(dirPath)) {
      throw new Error(`Directory does not exist: ${path}`);
    }

    return readdirSync(dirPath).length === 0;
  }
}