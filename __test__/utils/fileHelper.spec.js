import {
	copyFile,
	fileNameFormat,
	getCurrentWorkingDir,
	isFileExisting,
} from "../../utils/fileHelper.js";

describe("copyFile", () => {
	test("should return undefined", async () => {
		try {
			expect(await copyFile("", "")).toEqual(undefined);
		} catch (e) {
			expect(e.message).toEqual(
				"Error occurred when trying to copy file: Error: File path must be a non-empty string",
			);
		}
	});
});

describe("fileNameFormat", () => {
	test("should replace all spaces with -", async () => {
		expect(await fileNameFormat("hello world test")).toEqual("hello-world-test");
	});

	test("should trim the spaces", async () => {
		expect(await fileNameFormat(" hello world ")).toEqual("hello-world");
	});
	
	test("should handle multiple consecutive spaces", async () => {
		expect(await fileNameFormat("hello   world")).toEqual("hello-world");
	});
});

describe("isFileExisting", () => {
	test("should return false when file is not existed", async () => {
		expect(isFileExisting("hello world")).toBeFalsy();
	});

	test("should return true when file is existed", async () => {
		expect(isFileExisting("./package.json")).toBeTruthy();
	});
});

describe("getCurrentWorkingDir", () => {
	test("should return current working directory", async () => {
		expect(getCurrentWorkingDir()).toContain("flowmatic");
	});
});
