import replace from "replace-in-file";
import makeDir from "make-dir";
import cpy from "cpy";
import fs from "fs";

export async function replaceTextInFile(filePath, replaceString, withString) {
	const options = {
		files: filePath,
		from: replaceString,
		to: withString,
	};

	try {
		await replace(options);
	} catch (error) {
		console.error("Error occurred when trying to replace texts in file", error);
	}
}

export async function createDir(newDir) {
	await Promise.all([makeDir(newDir)]);
}

export async function copyFile(from, to) {
	try {
		await cpy(from, to);
	} catch (e) {
		throw Error(`Error occurred when trying to copy file: ${e}`);
	}
}

export function fileNameFormat(fileName) {
	return fileName.trim().replace(" ", "-");
}

export function getCurrentWorkingDir() {
	return process.cwd();
}

export function isFileExisting(pathToFile) {
	try {
		if (fs.existsSync(pathToFile)) {
			return true;
		}
	} catch (err) {
		console.error(`${pathToFile} is not existed`);
	}
	return false;
}
