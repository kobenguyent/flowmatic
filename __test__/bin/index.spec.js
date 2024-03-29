import run from "inquirer-test";
import path from "path";
import { ENTER } from "inquirer-test";

const runner = path.join(process.cwd(), "./bin/index.js");

describe("Flowmatic CLI", () => {
	describe("flows", () => {
		test("should see full flow", async () => {
			let result = await run([runner], [ENTER, ENTER, ENTER]);
			expect(result).toContain("Pipeline Creation at ease - supporting");
			expect(result).toContain("Which CI/CD are you currently using?");
		});
	});
});
