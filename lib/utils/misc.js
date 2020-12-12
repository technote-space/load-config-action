"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stringify = exports.isIgnoreWarning = exports.getRef = exports.setEnv = exports.getEnvName = exports.getSuffix = exports.getPrefix = exports.getRelativePath = exports.getConfigFilenames = void 0;
const core_1 = require("@actions/core");
const github_action_helper_1 = require("@technote-space/github-action-helper");
const getConfigFilenames = () => github_action_helper_1.Utils.getArrayInput('CONFIG_FILENAME', true);
exports.getConfigFilenames = getConfigFilenames;
const getRelativePath = () => core_1.getInput('RELATIVE_PATH', { required: true });
exports.getRelativePath = getRelativePath;
const getPrefix = () => core_1.getInput('PREFIX');
exports.getPrefix = getPrefix;
const getSuffix = () => core_1.getInput('SUFFIX');
exports.getSuffix = getSuffix;
const getEnvName = (name) => `${exports.getPrefix()}${name}${exports.getSuffix()}`;
exports.getEnvName = getEnvName;
const setEnv = (name, value) => core_1.exportVariable(exports.getEnvName(name), value);
exports.setEnv = setEnv;
const getRef = () => core_1.getInput('REF');
exports.getRef = getRef;
const isIgnoreWarning = () => github_action_helper_1.Utils.getBoolValue(core_1.getInput('IGNORE_WARNING'));
exports.isIgnoreWarning = isIgnoreWarning;
// eslint-disable-next-line @typescript-eslint/no-explicit-any,@typescript-eslint/explicit-module-boundary-types
const stringify = (config) => {
    if (typeof config !== 'object') {
        return config;
    }
    if (Array.isArray(config)) {
        return config.map(exports.stringify).join('\n');
    }
    return JSON.stringify(config);
};
exports.stringify = stringify;
