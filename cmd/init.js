import { isFileExisting } from "../utils/fileHelper.js";
import path from "path";
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Safely resolves the flowmatic directory path
 * Checks multiple possible locations in order of preference
 * @returns {string} The resolved flowmatic directory path
 */
export function getFlowmaticDir() {
	// Try to find the flowmatic directory in different locations
	const possiblePaths = [
		// When installed as npm package
		path.resolve("./node_modules/flowmatic-cicd"),
		// When running from source/development
		path.resolve(__dirname, ".."),
		// Fallback to current directory
		path.resolve(".")
	];

	for (const possiblePath of possiblePaths) {
		const packageJsonPath = path.join(possiblePath, "package.json");
		if (isFileExisting(packageJsonPath)) {
			// Verify this is actually flowmatic by checking package.json
			try {
				const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
				if (packageJson.name === 'flowmatic-cicd') {
					return possiblePath;
				}
			} catch (error) {
				// Continue to next path if package.json is invalid
			}
		}
	}

	// Fallback to current directory if nothing found
	return path.resolve(".");
}

/**
 * Gets the templates directory path
 * @returns {string} The templates directory path
 */
export function getTemplatesDir() {
	return path.join(getFlowmaticDir(), "templates");
}

export function init() {
	// Set global variables for backward compatibility
	global.flowmatic_dir = getFlowmaticDir();
}
