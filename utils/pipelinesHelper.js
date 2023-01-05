import {copyFile, createDir, getCurrentWorkingDir, isFileExisting, replaceTextInFile} from "./fileHelper.js";
import {moveFile} from "move-file";
import {data} from "../data/data.js";

const apiFileName = 'api.yml';

export function pipelineTypeValidation(pipelineType = '') {
    pipelineType = pipelineType.trim().toLowerCase();
    if (!data[pipelineType]) throw Error(`The passed pipeline type is not supported.`);

    return pipelineType;
}

export function testRunnerValidation(testRunner = '') {
    testRunner = testRunner.trim().toLowerCase();
    if (!(data.testRunner.includes(testRunner))) throw Error(`The passed test runner is not supported.`);

    return testRunner;
}

export async function initApiPipeline(pipelineType, pipelinePath, fileName) {
    pipelineType = pipelineTypeValidation(pipelineType);
    console.log(pipelineType)
    //if (isFileExisting(`${data[pipelineType].templatePath}/api`) === false || isFileExisting(`${data[pipelineType].templatePath}/api.yml`) === false) throw Error(`${data[pipelineType].templatePath}/api is not defined.`);

    try {
        if (pipelineType === 'jenkins') {
            await copyFile(`${data[pipelineType].templatePath}/api`, `${pipelinePath}`, {flat: true});
            await moveFile(`${pipelinePath}/api`, `${pipelinePath}/${fileName}`);
        } else {
            await copyFile(`${data[pipelineType].templatePath}/api*.yml`, `${pipelinePath}`, {flat: true});
            await moveFile(`${pipelinePath}/${apiFileName}`, `${pipelinePath}/${fileName}`);
        }

    } catch (e) {
        console.error(`Cannot create pipeline file due to: ${e.message}`)
    }
}

export async function initPublishPipeline(pipelineType, pipelinePath) {
    pipelineType = pipelineTypeValidation(pipelineType);

    if (isFileExisting(`${data[pipelineType].templatePath}/${data.npmPublishFileName}`) === false) throw Error(`${data[pipelineType].templatePath}/${data.npmPublishFileName} is not defined.`);

    try {
        await copyFile(`${data[pipelineType].templatePath}/npm-publish*.yml`, `${pipelinePath}`, {flat: true});
    } catch (e) {
        console.error(`Cannot create publish pipeline file due to: ${e.message}`)
    }
}

export async function initE2ePipeline(pipelineType, testRunner, pipelinePath, fileName) {
    testRunner = testRunnerValidation(testRunner);
    pipelineType = pipelineTypeValidation(pipelineType);

    if (pipelineType === 'jenkins') {
        await copyFile(`${data[pipelineType].templatePath}/${testRunner}*`, `${pipelinePath}`, {flat: true});
        await moveFile(`${pipelinePath}/${testRunner}`, `${pipelinePath}/${fileName}`);
    } else {
        await copyFile(`${data[pipelineType].templatePath}/${testRunner}*.yml`, `${pipelinePath}`, {flat: true});
        await moveFile(`${pipelinePath}/${testRunner}.yml`, `${pipelinePath}/${fileName}`);
    }
}

export async function createPipeline({pipelineType, testType, testRunner, pipelinePath, fileName, nodeVersion, runTestCommand, dronePipelineType, npmPublish}) {
    if (pipelinePath !== getCurrentWorkingDir()) {
        await createDir(pipelinePath);
    }

    if (npmPublish === true) {
        await initPublishPipeline(pipelineType, pipelinePath);
    }

    if (testType.toLowerCase() === 'api') {
        await initApiPipeline(pipelineType, pipelinePath, fileName);
    } else {
        await initE2ePipeline(pipelineType, testRunner, pipelinePath, fileName)
    }

    await replaceTextInFile(`${pipelinePath}/${fileName}`, new RegExp(/nodeVersion/g), nodeVersion);
    await replaceTextInFile(`${pipelinePath}/${fileName}`, new RegExp(/runTestCommand/g), runTestCommand);

    if (dronePipelineType) {
        await replaceTextInFile(`${pipelinePath}/${fileName}`, new RegExp(/dronePipelineType/g), dronePipelineType);
    }
}
