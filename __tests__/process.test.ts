/* eslint-disable no-magic-numbers */
import { describe, it } from 'vitest';
import nock from 'nock';
import { resolve } from 'path';
import {
  testEnv,
  getOctokit,
  generateContext,
  spyOnStdout,
  stdoutCalledWith,
  spyOnExportVariable,
  exportVariableCalledWith,
  disableNetConnect,
  getConfigFixture,
  getLogStdout,
} from '@technote-space/github-action-test-helper';
import { Logger } from '@technote-space/github-action-log-helper';
import { execute } from '../src/process';

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
          'buffer': '  Test1\n  Test2:\n',
          'position': 15,
          'line': 1,
          'column': 7,
          'snippet': ' 1 |   Test1\n 2 |   Test2:\n------------^',
        },
        'message': 'end of the stream or a document separator is expected (2:8)\n\n 1 |   Test1\n 2 |   Test2:\n------------^',
      }, '__error__'),
      '::group::Target config:',
      getLogStdout({}),
      '::endgroup::',
    ]);
  });

  it('should set env by yaml', async() => {
    process.env.INPUT_CONFIG_FILENAME = 'config.yml, 404.yml';
    process.env.INPUT_PREFIX          = 'INPUT_';
    process.env.INPUT_REF             = 'refs/pull/123/merge';
    const mockStdout                  = spyOnStdout();
    const mockEnv                     = spyOnExportVariable();
    nock('https://api.github.com')
      .get('/repos/hello/world/contents/' + encodeURIComponent('.github/config.yml') + '?ref=' + encodeURIComponent('refs/pull/123/merge'))
      .reply(200, getConfigFixture(fixturesDir, 'config.yml'))
      .get('/repos/hello/world/contents/' + encodeURIComponent('.github/404.yml') + '?ref=' + encodeURIComponent('refs/pull/123/merge'))
      .reply(404);

    await execute(new Logger(), getOctokit(), generateContext({
      owner: 'hello',
      repo: 'world',
    }));

    stdoutCalledWith(mockStdout, [
      '::warning::File not found [404.yml]',
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
    ]);
    exportVariableCalledWith(mockEnv, [
      { name: 'INPUT_test1', val: 'test1' },
      { name: 'INPUT_test2', val: 'test1\ntest2' },
      { name: 'INPUT_test3', val: '{"test4":"test5"}' },
    ]);
  });

  it('should set env by json', async() => {
    process.env.INPUT_CONFIG_FILENAME = 'config.json, 404.json';
    process.env.INPUT_SUFFIX          = '_SUFFIX';
    process.env.INPUT_REF             = 'v1.2.3';
    process.env.INPUT_IGNORE_WARNING  = 'true';
    const mockStdout                  = spyOnStdout();
    const mockEnv                     = spyOnExportVariable();
    nock('https://api.github.com')
      .get('/repos/hello/world/contents/' + encodeURIComponent('.github/config.json') + '?ref=' + encodeURIComponent('v1.2.3'))
      .reply(200, getConfigFixture(fixturesDir, 'config.json'))
      .get('/repos/hello/world/contents/' + encodeURIComponent('.github/404.json') + '?ref=' + encodeURIComponent('v1.2.3'))
      .reply(404);

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
    ]);
    exportVariableCalledWith(mockEnv, [
      { name: 'test1_SUFFIX', val: 'test1' },
      { name: 'test2_SUFFIX', val: 'test1\ntest2' },
      { name: 'test3_SUFFIX', val: '{"test4":"test5"}' },
    ]);
  });
});
