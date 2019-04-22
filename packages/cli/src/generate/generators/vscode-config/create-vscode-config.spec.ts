// FoalTS
import {
  rmDirAndFilesIfExist,
  TestEnvironment,
} from '../../utils';
import { createVSCodeConfig } from './create-vscode-config';

describe('createVSCodeConfig', () => {

  afterEach(() => rmDirAndFilesIfExist('.vscode'));

  const testEnv = new TestEnvironment('vscode-config', '.vscode');

  it('should create the directory .vscode/ with default launch.json and tasks.json files.', () => {
    createVSCodeConfig();

    testEnv
      .validateSpec('launch.json')
      .validateSpec('tasks.json');
  });

});
