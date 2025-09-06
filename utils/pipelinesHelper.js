import {
	copyFile,
	createDir,
	getCurrentWorkingDir,
	isFileExisting,
	replaceTextInFile,
	validatePath,
} from "./fileHelper.js";
import { moveFile } from "move-file";
import { data } from "../data/data.js";
import path from "path";

const apiFileName = "api.yml";

/**
 * Validates pipeline type and returns normalized value
 * @param {string} pipelineType - The pipeline type to validate
 * @returns {string} - The validated and normalized pipeline type
 * @throws {Error} - If pipeline type is not supported
 */
export function pipelineTypeValidation(pipelineType = "") {
	pipelineType = pipelineType.trim().toLowerCase();
	if (!data[pipelineType])
		throw Error("The passed pipeline type is not supported.");

	return pipelineType;
}

/**
 * Validates test runner and returns normalized value
 * @param {string} testRunner - The test runner to validate
 * @returns {string} - The validated and normalized test runner
 * @throws {Error} - If test runner is not supported
 */
export function testRunnerValidation(testRunner = "") {
	testRunner = testRunner.trim().toLowerCase();
	if (!data.testRunner.includes(testRunner))
		throw Error("The passed test runner is not supported.");

	return testRunner;
}

/**
 * Validates that a template file exists
 * @param {string} templatePath - Path to the template file
 * @throws {Error} - If template file doesn't exist
 */
function validateTemplateExists(templatePath) {
	if (!isFileExisting(templatePath)) {
		throw Error(`Template file ${templatePath} does not exist`);
	}
}

/**
 * Safely moves a file with error handling
 * @param {string} from - Source path
 * @param {string} to - Destination path
 */
async function safelyMoveFile(from, to) {
	try {
		const validatedFrom = validatePath(from);
		const validatedTo = validatePath(to);
		await moveFile(validatedFrom, validatedTo);
	} catch (error) {
		throw Error(`Failed to move file from ${from} to ${to}: ${error.message}`);
	}
}

export async function initApiPipeline(pipelineType, pipelinePath, fileName) {
	pipelineType = pipelineTypeValidation(pipelineType);
	
	const templatePath = data[pipelineType].templatePath;
	const apiTemplatePath = path.join(templatePath, "api.yml");
	
	if (!isFileExisting(apiTemplatePath)) {
		console.log(`${apiTemplatePath} is not defined.`);
		return;
	}

	try {
		if (pipelineType === "jenkins") {
			const jenkinsApiPath = path.join(templatePath, "api");
			validateTemplateExists(jenkinsApiPath);
			
			await copyFile(jenkinsApiPath, pipelinePath, { flat: true });
			await safelyMoveFile(
				path.join(pipelinePath, "api"), 
				path.join(pipelinePath, fileName)
			);
		} else {
			await copyFile(
				path.join(templatePath, "api*.yml"),
				pipelinePath,
				{ flat: true }
			);
			await safelyMoveFile(
				path.join(pipelinePath, apiFileName),
				path.join(pipelinePath, fileName)
			);
		}
	} catch (e) {
		console.error(`Cannot create pipeline file due to: ${e.message}`);
		throw e;
	}
}

export async function initPublishPipeline(pipelineType, pipelinePath) {
	pipelineType = pipelineTypeValidation(pipelineType);

	const templatePath = data[pipelineType].templatePath;
	const publishTemplatePath = path.join(templatePath, data.npmPublishFileName);
	
	if (!isFileExisting(publishTemplatePath)) {
		throw Error(`${publishTemplatePath} is not defined.`);
	}

	try {
		await copyFile(
			path.join(templatePath, "npm-publish*.yml"),
			pipelinePath,
			{ flat: true }
		);
	} catch (e) {
		console.error(`Cannot create publish pipeline file due to: ${e.message}`);
		throw e;
	}
}

export async function initE2ePipeline(
	pipelineType,
	testRunner,
	pipelinePath,
	fileName,
) {
	testRunner = testRunnerValidation(testRunner);
	pipelineType = pipelineTypeValidation(pipelineType);

	const templatePath = data[pipelineType].templatePath;

	try {
		if (pipelineType === "jenkins") {
			const jenkinsTemplatePath = path.join(templatePath, testRunner);
			validateTemplateExists(jenkinsTemplatePath);
			
			await copyFile(
				path.join(templatePath, `${testRunner}*`),
				pipelinePath,
				{ flat: true }
			);
			await safelyMoveFile(
				path.join(pipelinePath, testRunner),
				path.join(pipelinePath, fileName)
			);
		} else {
			const e2eTemplatePath = path.join(templatePath, `${testRunner}.yml`);
			validateTemplateExists(e2eTemplatePath);
			
			await copyFile(
				path.join(templatePath, `${testRunner}*.yml`),
				pipelinePath,
				{ flat: true }
			);
			await safelyMoveFile(
				path.join(pipelinePath, `${testRunner}.yml`),
				path.join(pipelinePath, fileName)
			);
		}
	} catch (e) {
		console.error(`Cannot create E2E pipeline file due to: ${e.message}`);
		throw e;
	}
}

export async function createPipeline({
	pipelineType,
	testType,
	testRunner,
	pipelinePath,
	fileName,
	nodeVersion,
	runTestCommand,
	dronePipelineType,
	npmPublish,
}) {
	try {
		// Validate inputs
		pipelineType = pipelineTypeValidation(pipelineType);
		const validatedPipelinePath = validatePath(pipelinePath);
		const currentWorkingDir = getCurrentWorkingDir();

		if (validatedPipelinePath !== currentWorkingDir) {
			await createDir(validatedPipelinePath);
		}

		if (npmPublish === true) {
			await initPublishPipeline(pipelineType, validatedPipelinePath);
		}

		if (testType.toLowerCase() === "api") {
			await initApiPipeline(pipelineType, validatedPipelinePath, fileName);
		} else {
			await initE2ePipeline(pipelineType, testRunner, validatedPipelinePath, fileName);
		}

		const finalFilePath = path.join(validatedPipelinePath, fileName);

		// Replace placeholders in the pipeline file
		await replaceTextInFile(
			finalFilePath,
			new RegExp(/nodeVersion/g),
			nodeVersion,
		);
		await replaceTextInFile(
			finalFilePath,
			new RegExp(/runTestCommand/g),
			runTestCommand,
		);

		if (dronePipelineType) {
			await replaceTextInFile(
				finalFilePath,
				new RegExp(/dronePipelineType/g),
				dronePipelineType,
			);
		}
	} catch (error) {
		console.error(`Failed to create pipeline: ${error.message}`);
		throw error;
	}
}
