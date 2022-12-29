#!/usr/bin/env node
import chalk from 'chalk';
import inquirer from 'inquirer';
import { fileNameFormat, getCurrentWorkingDir} from "../utils/fileHelper.js";

import {data} from "../data/data.js";
import {createPipeline} from "../utils/pipelinesHelper.js";

import CFonts from 'cfonts';

CFonts.say('Flowmatic CICD', {
    font: 'chrome',              // define the font face
    align: 'left',              // define text alignment
    colors: ['system'],         // define all colors
    background: 'transparent',  // define the background color, you can also use `backgroundColor` here as key
    space: true,                // define if the output text should have empty lines on top and on the bottom
    maxLength: '0',             // define how many character can be on one line
    gradient: ['yellow',"#805ad5"],            // define your two gradient colors
    independentGradient: true, // define if you want to recalculate the gradient for each new line
    transitionGradient: false,  // define if this is a transition between colors directly
    env: 'node'                 // define the environment CFonts is being executed in
});
console.log(` 🔌 Pipeline Creation at ease - supporting ${chalk.green(data.pipelineType.map(item => item.toUpperCase()))} \n`);

inquirer
    .prompt([
        {
            type: 'list',
            name: 'cicd',
            message: 'Which CI/CD are you currently using?',
            choices: data.pipelineType.map(item => item.toUpperCase()),
        },
        {
            type: 'list',
            name: 'nodeVersion',
            message: 'Which Node version do you want to use?',
            choices: data.nodeVersion,
        },
        {
            type: 'list',
            name: 'testType',
            message: 'Which type of tests are you implementing?',
            choices: data.testType.map(item => item.toUpperCase()),
        },
        {
            type: 'list',
            name: 'testRunner',
            message: 'Which test runner are you using?',
            choices: data.testRunner.map(item => item.toUpperCase()),
            when: (answers) => ['e2e'].includes(answers.testType.toLowerCase()) === true,
        },
        {
            type: 'input',
            name: 'fileName',
            message: 'How do you name your workflow file?',
            default: 'run test',
            when: (answers) => ['github'].includes(answers.cicd.toLowerCase()) === true,
        },
        {
            type: 'input',
            name: 'runTestCommand',
            message: 'What is your command to run tests?',
            default: 'npm run test'
        },
    ])
    .then(async(answers) => {
        let pipelinePath = getCurrentWorkingDir();
        let fileName;
        const pipelineType = answers.cicd.toLowerCase();

        if (pipelineType === 'github') {
            pipelinePath = `${getCurrentWorkingDir()}/.github/workflows`;
            fileName = `${fileNameFormat(answers.fileName)}.yml`;
        }

        if (pipelineType === 'gitlab') {
            fileName = `.gitlab-ci.yml`;
        }

        if (pipelineType === 'bitbucket') {
            fileName = `bitbucket-pipelines.yml`;
        }

        if (pipelineType === 'azure') {
            fileName = `azure-pipelines.yml`;
        }

        try {
            await createPipeline({ pipelineType, testType: answers.testType, testRunner: answers.testRunner, pipelinePath: pipelinePath, fileName, nodeVersion: answers.nodeVersion, runTestCommand: answers.runTestCommand })
            console.log(`The pipeline for ${chalk.green(answers.cicd)} could be found at: ` + chalk.blue(`${pipelinePath}/${fileName}`));
        } catch (e) {
            console.error(e);
        }

    });
