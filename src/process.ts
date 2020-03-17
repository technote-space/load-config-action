import { Context } from '@actions/github/lib/context';
import { Octokit } from '@octokit/rest';
import { Logger } from '@technote-space/github-action-helper';
import { getConfig } from '@technote-space/github-action-config-helper';
import { getConfigFilename, getRelativePath, setEnv } from './utils/misc';

export const execute = async(logger: Logger, octokit: Octokit, context: Context): Promise<boolean> => {
	const config = await getConfig(getConfigFilename(), octokit, context, {configPath: getRelativePath()});
	if (false === config) {
		logger.warn('The specified file [%s] does not exist or is invalid.', getConfigFilename());
		return false;
	}

	logger.startProcess('Target config: ');
	console.log(config);
	logger.endProcess();

	Object.keys(config).forEach(key => {
		setEnv(key, JSON.stringify(config[key]));
	});

	return true;
};
