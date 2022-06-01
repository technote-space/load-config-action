import type { Context } from '@actions/github/lib/context';
import type { Octokit } from '@technote-space/github-action-helper';
import type { Logger } from '@technote-space/github-action-log-helper';
import { getConfig } from '@technote-space/github-action-config-helper';
import { getConfigFilenames, getRelativePath, setEnv, getRef, stringify, isIgnoreWarning } from './utils/misc';

export const execute = async(logger: Logger, octokit: Octokit, context: Context): Promise<void> => {
  const config = await getConfigFilenames().reduce(async(prev, name) => {
    const acc    = await prev;
    const config = await getConfig(name, octokit, context, { configPath: getRelativePath(), ref: getRef() });
    if (false === config) {
      if (!isIgnoreWarning()) {
        logger.warn('File not found [%s]', name);
      }

      return acc;
    }

    return { ...acc, ...config };
  }, Promise.resolve({}));

  logger.startProcess('Target config:');
  console.log(config);
  logger.endProcess();

  Object.keys(config).forEach(key => {
    setEnv(key, stringify(config[key]));
  });
};
