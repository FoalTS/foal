// FoalTS
import { FileSystem } from '../../file-system';
import { createVSCodeConfig } from './create-vscode-config';

describe('createVSCodeConfig', () => {
  const fs = new FileSystem();

  beforeEach(() => fs.setUp());

  afterEach(() => fs.tearDown());

  it('should create the directory .vscode/ with default launch.json and tasks.json files.', () => {
    createVSCodeConfig();

    fs
      .cd('.vscode')
      .assertEqual('launch.json', 'vscode-config/launch.json')
      .assertEqual('tasks.json', 'vscode-config/tasks.json');
  });

});
