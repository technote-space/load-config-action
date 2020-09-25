import {resolve} from 'path';
import {
  testEnv,
  spyOnExportVariable,
  exportVariableCalledWith,
} from '@technote-space/github-action-test-helper';
import {getConfigFilename, getRelativePath, setEnv} from '../../src/utils/misc';

const rootDir = resolve(__dirname, '../..');

describe('getConfigFilename', () => {
  testEnv(rootDir);

  it('should throw error', () => {
    expect(() => getConfigFilename()).toThrow('');
  });

  it('should get config file name', () => {
    process.env.INPUT_CONFIG_FILENAME = 'test.yml';

    expect(getConfigFilename()).toBe('test.yml');
  });
});

describe('getRelativePath', () => {
  testEnv(rootDir);

  it('should throw error', () => {
    process.env.INPUT_RELATIVE_PATH = '';
    expect(() => getRelativePath()).toThrow('');
  });

  it('should get config file name', () => {
    expect(getRelativePath()).toBe('.github');
  });
});

describe('setEnv', () => {
  it('should run set env command', () => {
    const mockEnv = spyOnExportVariable();

    setEnv('test-name', 'test-value');

    exportVariableCalledWith(mockEnv, [
      {name: 'test-name', val: 'test-value'},
    ]);
  });
});
