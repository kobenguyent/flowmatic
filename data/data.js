export const data = {
    pipelineType: ['github', 'gitlab', 'bitbucket', 'azure'],
    nodeVersion: ['14', '16', '18'],
    testType: ['api', 'e2e'],
    testRunner: ['playwright', 'puppeteer', 'wdio'],
    github: {
        templatePath: './templates/github'
    },
    gitlab: {
        templatePath: './templates/gitlab'
    },
    bitbucket: {
        templatePath: './templates/bitbucket'
    },
    azure: {
        templatePath: './templates/azure'
    }

}
