// FoalTS
import {
  rmdirIfExists,
  rmfileIfExists,
  TestEnvironment,
} from '../../utils';
import { createVSCodeConfig } from './create-vscode-config';

describe('createVSCodeConfig', () => {

  afterEach(() => {
    rmfileIfExists('.vscode/launch.json');
    rmfileIfExists('.vscode/tasks.json');
    rmdirIfExists('.vscode');
  });

  const testEnv = new TestEnvironment('vscode-config', '.vscode');

  it('should create the directory .vscode/ with default launch.json and tasks.json files.', () => {
    createVSCodeConfig();

    testEnv
      .validateSpec('launch.json')
      .validateSpec('tasks.json');
  });

});
