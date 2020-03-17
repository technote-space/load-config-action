import { getInput, exportVariable } from '@actions/core' ;

export const getConfigFilename = (): string => getInput('CONFIG_FILENAME', {required: true});

export const getRelativePath = (): string => getInput('RELATIVE_PATH', {required: true});

export const getPrefix = (): string => getInput('PREFIX');

export const getSuffix = (): string => getInput('SUFFIX');

export const getEnvName = (name: string): string => `${getPrefix()}${name}${getSuffix()}`;

export const setEnv = (name: string, value: string): void => exportVariable(getEnvName(name), value);

export const getRef = (): string => getInput('REF');
