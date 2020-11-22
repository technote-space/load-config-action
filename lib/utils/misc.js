"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stringify = exports.getRef = exports.setEnv = exports.getEnvName = exports.getSuffix = exports.getPrefix = exports.getRelativePath = exports.getConfigFilename = void 0;
const core_1 = require("@actions/core");
const getConfigFilename = () => core_1.getInput('CONFIG_FILENAME', { required: true });
exports.getConfigFilename = getConfigFilename;
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
