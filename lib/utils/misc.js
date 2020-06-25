"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stringify = exports.getRef = exports.setEnv = exports.getEnvName = exports.getSuffix = exports.getPrefix = exports.getRelativePath = exports.getConfigFilename = void 0;
const core_1 = require("@actions/core");
exports.getConfigFilename = () => core_1.getInput('CONFIG_FILENAME', { required: true });
exports.getRelativePath = () => core_1.getInput('RELATIVE_PATH', { required: true });
exports.getPrefix = () => core_1.getInput('PREFIX');
exports.getSuffix = () => core_1.getInput('SUFFIX');
exports.getEnvName = (name) => `${exports.getPrefix()}${name}${exports.getSuffix()}`;
exports.setEnv = (name, value) => core_1.exportVariable(exports.getEnvName(name), value);
exports.getRef = () => core_1.getInput('REF');
// eslint-disable-next-line @typescript-eslint/no-explicit-any,@typescript-eslint/explicit-module-boundary-types
exports.stringify = (config) => {
    if (typeof config !== 'object') {
        return config;
    }
    if (Array.isArray(config)) {
        return config.map(exports.stringify).join('\n');
    }
    return JSON.stringify(config);
};
