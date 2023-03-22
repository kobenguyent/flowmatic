import { copyFile } from "./fileHelper.js";
import { data } from "../data/data.js";

export async function initRome(path) {
	try {
		await copyFile(`${data.roma.templatePath}/rome.json`, path, { flat: true });
		console.log("Please run npm install --save-dev rome to install Rome");
		console.log(
			'🍺 To format code add this to your package.json: "code:format": "npx rome format"',
		);
		console.log(
			'🍺 To lint code add this to your package.json: "code:lint": "npx rome check"',
		);
		console.log(
			"🍺 More info could be found at: https://docs.rome.tools/guides/getting-started/",
		);
	} catch (e) {
		console.error(`Cannot init Rome configuration due to: ${e.message}`);
	}
}
