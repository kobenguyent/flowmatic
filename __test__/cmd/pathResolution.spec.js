import { getFlowmaticDir, getTemplatesDir } from "../../cmd/init.js";
import { isFileExisting } from "../../utils/fileHelper.js";
import path from "path";

describe("Path Resolution Improvements", () => {
	describe("getFlowmaticDir", () => {
		test("should return a valid directory path", () => {
			const flowmaticDir = getFlowmaticDir();
			expect(typeof flowmaticDir).toBe("string");
			expect(flowmaticDir.length).toBeGreaterThan(0);
			expect(path.isAbsolute(flowmaticDir)).toBe(true);
		});

		test("should find package.json in the returned directory", () => {
			const flowmaticDir = getFlowmaticDir();
			const packageJsonPath = path.join(flowmaticDir, "package.json");
			expect(isFileExisting(packageJsonPath)).toBe(true);
		});
	});

	describe("getTemplatesDir", () => {
		test("should return templates directory path", () => {
			const templatesDir = getTemplatesDir();
			expect(typeof templatesDir).toBe("string");
			expect(templatesDir).toContain("templates");
			expect(path.isAbsolute(templatesDir)).toBe(true);
		});

		test("should contain template directories", () => {
			const templatesDir = getTemplatesDir();
			const githubTemplateDir = path.join(templatesDir, "github");
			expect(isFileExisting(githubTemplateDir)).toBe(true);
		});

		test("should have github template files", () => {
			const templatesDir = getTemplatesDir();
			const apiTemplate = path.join(templatesDir, "github", "api.yml");
			expect(isFileExisting(apiTemplate)).toBe(true);
		});
	});
});