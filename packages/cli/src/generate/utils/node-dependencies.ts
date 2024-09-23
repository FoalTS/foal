export type NpmPackageVersionPrefix = '' | '^' | '~';

const supportedPrefixes = ['^', '~'];

export interface INpmPackage {
  dependencies: Record<string, string>;
  devDependencies: Record<string, string>;
}

export interface IPrefixSettings {
  prefix: NpmPackageVersionPrefix;
  keepExistingPrefix?: boolean;
}

export class NodeDependencies {
  private dependencies: Record<string, string>;

  constructor(packageDependencies: Record<string, string>) {
    this.dependencies = { ...packageDependencies };
  }

  getDependencies(): Record<string, string> {
    return { ...this.dependencies };
  }

  /**
   * Installs a dependency if it does not exists.
   * Updates a dependency if it exists.
   * @param name Dependency name.
   * @param version New version.
   * @param prefix New or default prefix.
   * @param keepExistingPrefix Keeps the version prefix.
   */
  setOrUpdate(name: string, version: string, prefix: string, keepExistingPrefix: boolean): void {
    if (!this.exists(name) || !keepExistingPrefix) {
      this.dependencies[name] = `${prefix}${version}`;
    }
    else if (this.isPrefixed(name)) {
      const existingPrefix = this.dependencies[name][0];
      this.dependencies[name] = `${existingPrefix}${version}`;
    }
    else {
      this.dependencies[name] = `${prefix}${version}`;
    }
  }

  private isPrefixed(name: string): boolean {
    return supportedPrefixes.includes(this.dependencies[name][0]);
  }

  private exists(name: string): boolean {
    return !!this.dependencies[name];
  }
}