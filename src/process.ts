import {Context} from '@actions/github/lib/context';
import {Logger} from '@technote-space/github-action-log-helper';
import {Octokit} from '@technote-space/github-action-helper/dist/types';
import {getConfig} from '@technote-space/github-action-config-helper';
import {getConfigFilename, getRelativePath, setEnv, getRef, stringify} from './utils/misc';

export const execute = async(logger: Logger, octokit: Octokit, context: Context): Promise<void> => {
  const config = await getConfig(getConfigFilename(), octokit, context, {configPath: getRelativePath(), ref: getRef()});

  logger.startProcess('Target config:');
  console.log(config);
  logger.endProcess();

  Object.keys(config).forEach(key => {
    setEnv(key, stringify(config[key]));
  });
};
