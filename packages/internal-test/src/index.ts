/**
 * FoalTS
 * Copyright(c) 2017-2025 Loïc Poullain
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

  readSize() {
    return Promise.resolve(22);
  }

  delete() {
    throw new Error('internal-test package: delete called');
  }
}

// Used in @foal/core:
export class ConcreteSessionStore {

}

export const aNum = 1;
