import { isFileExisting } from "../utils/fileHelper.js";

export function init() {
	global.flowmatic_dir = isFileExisting(
		"./node_modules/flowmatic-cicd/package.json",
	)
		? "./node_modules/flowmatic-cicd"
		: ".";
}
