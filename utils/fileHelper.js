import replace from "replace-in-file";
import makeDir from "make-dir";
import cpy from "cpy";
import fs from "fs";
import path from "path";

/**
 * Validates and sanitizes a file path
 * @param {string} filePath - The file path to validate
 * @returns {string} - The sanitized path
 * @throws {Error} - If path is invalid or potentially dangerous
 */
export function validatePath(filePath) {
	if (!filePath || typeof filePath !== 'string') {
		throw new Error('File path must be a non-empty string');
	}
	
	// Check for dangerous path patterns before resolving
	if (filePath.includes('..') || filePath.includes('~')) {
		throw new Error('Path contains potentially dangerous patterns');
	}
	
	// Resolve the path to get absolute path
	const resolvedPath = path.resolve(filePath);
	
	return resolvedPath;
}

/**
 * Validates and sanitizes a file name
 * @param {string} fileName - The file name to validate
 * @returns {string} - The sanitized file name
 */
export function validateFileName(fileName) {
	if (!fileName || typeof fileName !== 'string') {
		throw new Error('File name must be a non-empty string');
	}
	
	// Remove or replace dangerous characters
	const sanitized = fileName
		.replace(/[<>:"/\\|?*]/g, '') // Remove filesystem-dangerous chars
		.replace(/\0/g, '') // Remove null bytes
		.trim();
		
	if (sanitized.length === 0) {
		throw new Error('File name becomes empty after sanitization');
	}
	
	return sanitized;
}

export async function replaceTextInFile(filePath, replaceString, withString) {
	try {
		const validatedPath = validatePath(filePath);
		
		const options = {
			files: validatedPath,
			from: replaceString,
			to: withString,
		};

		await replace(options);
	} catch (error) {
		console.error("Error occurred when trying to replace texts in file", error);
		throw error;
	}
}

export async function createDir(newDir) {
	try {
		const validatedPath = validatePath(newDir);
		await Promise.all([makeDir(validatedPath)]);
	} catch (error) {
		console.error("Error occurred when trying to create directory", error);
		throw error;
	}
}

export async function copyFile(from, to, options = {}) {
	try {
		// Don't validate paths if they're glob patterns (indicated by presence of wildcards)
		const hasWildcards = /[*{}[\]?]/.test(from);
		
		if (!hasWildcards) {
			validatePath(from);
		}
		
		if (typeof to === 'string' && !hasWildcards) {
			validatePath(to);
		}
		
		await cpy(from, to, options);
	} catch (e) {
		throw Error(`Error occurred when trying to copy file: ${e}`);
	}
}

export function fileNameFormat(fileName) {
	const sanitized = validateFileName(fileName);
	return sanitized.trim().replace(/\s+/g, "-");
}

export function getCurrentWorkingDir() {
	return validatePath(process.cwd());
}

export function isFileExisting(pathToFile) {
	try {
		const validatedPath = validatePath(pathToFile);
		if (fs.existsSync(validatedPath)) {
			return true;
		}
	} catch (err) {
		console.error(`${pathToFile} is not accessible: ${err.message}`);
	}
	return false;
}
