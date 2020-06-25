/* eslint-disable no-magic-numbers */
import nock from 'nock';
import {resolve} from 'path';
import {
  testEnv,
  spyOnStdout,
  getOctokit,
  generateContext,
  stdoutCalledWith,
  disableNetConnect,
  getConfigFixture,
  getLogStdout,
} from '@technote-space/github-action-test-helper';
import {Logger} from '@technote-space/github-action-helper';
import {execute} from '../src/process';

const rootDir     = resolve(__dirname, '..');
const fixturesDir = resolve(__dirname, 'fixtures');

describe('execute', () => {
  testEnv(rootDir);
  disableNetConnect(nock);

  it('should not set env', async() => {
    process.env.INPUT_CONFIG_FILENAME = 'error.yml';
    process.env.INPUT_REF             = 'refs/heads/master';
    const mockStdout                  = spyOnStdout();
    nock('https://api.github.com')
      .get('/repos/hello/world/contents/' + encodeURIComponent('.github/error.yml') + '?ref=' + encodeURIComponent('refs/heads/master'))
      .reply(200, getConfigFixture(fixturesDir, 'error.yml'));

    await execute(new Logger(), getOctokit(), generateContext({
      owner: 'hello',
      repo: 'world',
    }));

    stdoutCalledWith(mockStdout, [
      getLogStdout({
        'name': 'YAMLException',
        'reason': 'end of the stream or a document separator is expected',
        'mark': {
          'name': null,
          'buffer': '  Test1\n  Test2:\n\u0000',
          'position': 15,
          'line': 1,
          'column': 7,
        },
        'message': 'end of the stream or a document separator is expected at line 2, column 8:\n      Test2:\n           ^',
      }, '__error__'),
      '::group::Target config:',
      getLogStdout({}),
      '::endgroup::',
    ]);
  });

  it('should set env by yaml', async() => {
    process.env.INPUT_CONFIG_FILENAME = 'config.yml';
    process.env.INPUT_PREFIX          = 'INPUT_';
    process.env.INPUT_REF             = 'refs/pull/123/merge';
    const mockStdout                  = spyOnStdout();
    nock('https://api.github.com')
      .get('/repos/hello/world/contents/' + encodeURIComponent('.github/config.yml') + '?ref=' + encodeURIComponent('refs/pull/123/merge'))
      .reply(200, getConfigFixture(fixturesDir, 'config.yml'));

    await execute(new Logger(), getOctokit(), generateContext({
      owner: 'hello',
      repo: 'world',
    }));

    stdoutCalledWith(mockStdout, [
      '::group::Target config:',
      getLogStdout({
        'test1': 'test1',
        'test2': [
          'test1',
          'test2',
        ],
        'test3': {
          'test4': 'test5',
        },
      }),
      '::endgroup::',
      '::set-env name=INPUT_test1::test1',
      '::set-env name=INPUT_test2::test1%0Atest2',
      '::set-env name=INPUT_test3::{"test4":"test5"}',
    ]);
  });

  it('should set env by json', async() => {
    process.env.INPUT_CONFIG_FILENAME = 'config.json';
    process.env.INPUT_SUFFIX          = '_SUFFIX';
    process.env.INPUT_REF             = 'v1.2.3';
    const mockStdout                  = spyOnStdout();
    nock('https://api.github.com')
      .get('/repos/hello/world/contents/' + encodeURIComponent('.github/config.json') + '?ref=' + encodeURIComponent('v1.2.3'))
      .reply(200, getConfigFixture(fixturesDir, 'config.json'));

    await execute(new Logger(), getOctokit(), generateContext({
      owner: 'hello',
      repo: 'world',
    }));

    stdoutCalledWith(mockStdout, [
      '::group::Target config:',
      getLogStdout({
        'test1': 'test1',
        'test2': [
          'test1',
          'test2',
        ],
        'test3': {
          'test4': 'test5',
        },
      }),
      '::endgroup::',
      '::set-env name=test1_SUFFIX::test1',
      '::set-env name=test2_SUFFIX::test1%0Atest2',
      '::set-env name=test3_SUFFIX::{"test4":"test5"}',
    ]);
  });
});