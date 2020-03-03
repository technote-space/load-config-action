/* eslint-disable no-magic-numbers */
import nock from 'nock';
import { resolve } from 'path';
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
import { Logger } from '@technote-space/github-action-helper';
import { execute } from '../src/process';

const rootDir     = resolve(__dirname, '..');
const fixturesDir = resolve(__dirname, 'fixtures');

describe('execute', () => {
	testEnv(rootDir);
	disableNetConnect(nock);

	it('should throw error', async() => {
		process.env.INPUT_CONFIG_FILENAME = 'error.yml';
		const mockStdout                  = spyOnStdout();
		nock('https://api.github.com')
			.get('/repos/hello/world/contents/.github/error.yml')
			.reply(200, getConfigFixture(fixturesDir, 'error.yml'));

		await expect(execute(new Logger(), getOctokit(), generateContext({
			owner: 'hello',
			repo: 'world',
		}))).rejects.toThrow('end of the stream or a document separator is expected at line 2, column 6:\n' +
			'    Test2:\n' +
			'         ^');

		stdoutCalledWith(mockStdout, []);
	});

	it('should do nothing', async() => {
		process.env.INPUT_CONFIG_FILENAME = 'empty.yml';
		const mockStdout                  = spyOnStdout();
		nock('https://api.github.com')
			.get('/repos/hello/world/contents/.github/empty.yml')
			.reply(200, getConfigFixture(fixturesDir, 'empty.yml'));

		expect(await execute(new Logger(), getOctokit(), generateContext({
			owner: 'hello',
			repo: 'world',
		}))).toBe(false);

		stdoutCalledWith(mockStdout, [
			'::warning::The specified file [empty.yml] does not exist or is invalid.',
		]);
	});


	it('should set env', async() => {
		process.env.INPUT_CONFIG_FILENAME = 'config.yml';
		process.env.INPUT_PREFIX          = 'INPUT_';
		const mockStdout                  = spyOnStdout();
		nock('https://api.github.com')
			.get('/repos/hello/world/contents/.github/config.yml')
			.reply(200, getConfigFixture(fixturesDir, 'config.yml'));

		expect(await execute(new Logger(), getOctokit(), generateContext({
			owner: 'hello',
			repo: 'world',
		}))).toBe(true);

		stdoutCalledWith(mockStdout, [
			'::group::Target config: ',
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
			'::set-env name=INPUT_test1::"test1"',
			'::set-env name=INPUT_test2::["test1","test2"]',
			'::set-env name=INPUT_test3::{"test4":"test5"}',
		]);
	});
});
