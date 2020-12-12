import {resolve} from 'path';
import {
  testEnv,
  spyOnExportVariable,
  exportVariableCalledWith,
} from '@technote-space/github-action-test-helper';
import {getConfigFilenames, getRelativePath, setEnv, isIgnoreWarning} from '../../src/utils/misc';

const rootDir = resolve(__dirname, '../..');

describe('getConfigFilenames', () => {
  testEnv(rootDir);

  it('should throw error', () => {
    expect(() => getConfigFilenames()).toThrow('');
  });

  it('should get config filename', () => {
    process.env.INPUT_CONFIG_FILENAME = 'test.yml';

    expect(getConfigFilenames()).toEqual(['test.yml']);
  });

  it('should get config filenames', () => {
    process.env.INPUT_CONFIG_FILENAME = 'test1.yml, test2.yml\ntest3.yml';

    expect(getConfigFilenames()).toEqual(['test1.yml', 'test2.yml', 'test3.yml']);
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

describe('isIgnoreWarning', () => {
  testEnv(rootDir);

  it('should return false', () => {
    expect(isIgnoreWarning()).toBe(false);
  });

  it('should return true', () => {
    process.env.INPUT_IGNORE_WARNING = '1';

    expect(isIgnoreWarning()).toBe(true);
  });
});
