import {init} from "../cmd/init.js";
init();

global.flowmatic_templates_dir = `${global.flowmatic_dir}/templates`;

export const data = {
    pipelineType: ['github', 'gitlab', 'bitbucket', 'azure'],
    nodeVersion: ['14', '16', '18'],
    testType: ['api', 'e2e'],
    testRunner: ['playwright', 'puppeteer', 'wdio'],
    github: {
        templatePath: `${global.flowmatic_templates_dir}/github`
    },
    gitlab: {
        templatePath: `${global.flowmatic_templates_dir}/gitlab`
    },
    bitbucket: {
        templatePath: `${global.flowmatic_templates_dir}/bitbucket`
    },
    azure: {
        templatePath: `${global.flowmatic_templates_dir}/azure`
    }

}
