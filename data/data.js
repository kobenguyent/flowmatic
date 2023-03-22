import { init } from "../cmd/init.js";
init();

global.flowmatic_templates_dir = `${global.flowmatic_dir}/templates`;

export const data = {
	pipelineType: ["github", "gitlab", "bitbucket", "azure", "drone", "jenkins"],
	dronePipelineType: ["docker", "kubernetes"],
	nodeVersion: ["16", "18", "19"],
	testType: ["api", "e2e"],
	testRunner: ["playwright", "puppeteer", "wdio"],
	npmPublishFileName: "npm-publish.yml",
	github: {
		templatePath: `${global.flowmatic_templates_dir}/github`,
	},
	gitlab: {
		templatePath: `${global.flowmatic_templates_dir}/gitlab`,
	},
	bitbucket: {
		templatePath: `${global.flowmatic_templates_dir}/bitbucket`,
	},
	azure: {
		templatePath: `${global.flowmatic_templates_dir}/azure`,
	},
	drone: {
		templatePath: `${global.flowmatic_templates_dir}/drone`,
	},
	jenkins: {
		templatePath: `${global.flowmatic_templates_dir}/jenkins`,
	},
	roma: {
		templatePath: `${global.flowmatic_templates_dir}/roma`,
	},
};
