import {getInput, exportVariable} from '@actions/core' ;
import {Utils} from '@technote-space/github-action-helper';

export const getConfigFilenames = (): Array<string> => Utils.getArrayInput('CONFIG_FILENAME', true);

export const getRelativePath = (): string => getInput('RELATIVE_PATH', {required: true});

export const getPrefix = (): string => getInput('PREFIX');

export const getSuffix = (): string => getInput('SUFFIX');

export const getEnvName = (name: string): string => `${getPrefix()}${name}${getSuffix()}`;

export const setEnv = (name: string, value: string): void => exportVariable(getEnvName(name), value);

export const getRef = (): string => getInput('REF');

export const isIgnoreWarning = (): boolean => Utils.getBoolValue(getInput('IGNORE_WARNING'));

// eslint-disable-next-line @typescript-eslint/no-explicit-any,@typescript-eslint/explicit-module-boundary-types
export const stringify = (config: any): string => {
  if (typeof config !== 'object') {
    return config;
  }

  if (Array.isArray(config)) {
    return config.map(stringify).join('\n');
  }

  return JSON.stringify(config);
};
