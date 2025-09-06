import { validatePath, validateFileName } from "../../utils/fileHelper.js";

describe("Path Security Validation", () => {
	describe("validatePath", () => {
		test("should reject empty path", () => {
			expect(() => validatePath("")).toThrow("File path must be a non-empty string");
		});

		test("should reject non-string path", () => {
			expect(() => validatePath(null)).toThrow("File path must be a non-empty string");
			expect(() => validatePath(undefined)).toThrow("File path must be a non-empty string");
			expect(() => validatePath(123)).toThrow("File path must be a non-empty string");
		});

		test("should reject dangerous path patterns", () => {
			expect(() => validatePath("../../../etc/passwd")).toThrow("Path contains potentially dangerous patterns");
			expect(() => validatePath("~/secret")).toThrow("Path contains potentially dangerous patterns");
		});

		test("should accept valid paths", () => {
			expect(() => validatePath("/tmp/safe/path")).not.toThrow();
			expect(() => validatePath("./safe/path")).not.toThrow();
			expect(() => validatePath("safe/path")).not.toThrow();
		});
	});

	describe("validateFileName", () => {
		test("should reject empty file name", () => {
			expect(() => validateFileName("")).toThrow("File name must be a non-empty string");
		});

		test("should reject dangerous characters", () => {
			const dangerousNames = ["file<name", "file>name", "file:name", 'file"name', 
								   "file/name", "file\\name", "file|name", "file?name", "file*name"];
			dangerousNames.forEach(name => {
				expect(validateFileName(name)).not.toContain("<>:\"/\\|?*");
			});
		});

		test("should accept valid file names", () => {
			expect(validateFileName("valid-file-name")).toBe("valid-file-name");
			expect(validateFileName("valid_file_name")).toBe("valid_file_name");
			expect(validateFileName("ValidFileName123")).toBe("ValidFileName123");
		});

		test("should trim whitespace", () => {
			expect(validateFileName("  file-name  ")).toBe("file-name");
		});
	});
});