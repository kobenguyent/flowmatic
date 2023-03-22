import {
	pipelineTypeValidation,
	testRunnerValidation,
} from "../../utils/pipelinesHelper.js";

describe("pipelineTypeValidation", () => {
	test("should return error when nothing is passed", async () => {
		try {
			pipelineTypeValidation();
		} catch (e) {
			expect(e.message).toEqual("The passed pipeline type is not supported.");
		}
	});

	test("should return error when unsupported pipeline is passed", async () => {
		try {
			pipelineTypeValidation("helloworld");
		} catch (e) {
			expect(e.message).toEqual("The passed pipeline type is not supported.");
		}
	});

	test("should return no error when supported pipeline is passed", async () => {
		expect(pipelineTypeValidation("github")).toEqual("github");
	});
});

describe("testRunnerValidation", () => {
	test("should return error when nothing is passed", async () => {
		try {
			testRunnerValidation();
		} catch (e) {
			expect(e.message).toEqual("The passed test runner is not supported.");
		}
	});

	test("should return error when unsupported test runner is passed", async () => {
		try {
			testRunnerValidation("helloworld");
		} catch (e) {
			expect(e.message).toEqual("The passed test runner is not supported.");
		}
	});

	test("should return no error when supported test runner is passed", async () => {
		expect(testRunnerValidation("playwright")).toEqual("playwright");
	});
});
