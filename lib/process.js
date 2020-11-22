"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.execute = void 0;
const github_action_config_helper_1 = require("@technote-space/github-action-config-helper");
const misc_1 = require("./utils/misc");
const execute = (logger, octokit, context) => __awaiter(void 0, void 0, void 0, function* () {
    const config = yield github_action_config_helper_1.getConfig(misc_1.getConfigFilename(), octokit, context, { configPath: misc_1.getRelativePath(), ref: misc_1.getRef() });
    logger.startProcess('Target config:');
    console.log(config);
    logger.endProcess();
    Object.keys(config).forEach(key => {
        misc_1.setEnv(key, misc_1.stringify(config[key]));
    });
});
exports.execute = execute;
