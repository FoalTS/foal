/**
 * FoalTS
 * Copyright(c) 2017-2020 Loïc Poullain <loic.poullain@centraliens.net>
 * Released under the MIT License.
 */

// Used in @foal/storage:
export class ConcreteDisk {
  write() {
    throw new Error('internal-test package: write called');
  }

  read() {
    throw new Error('internal-test package: read called');
  }

  delete() {
    throw new Error('internal-test package: delete called');
  }
}

// Used in @foal/core:
export class ConcreteSessionStore {

}
