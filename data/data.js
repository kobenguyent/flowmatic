import { init, getTemplatesDir } from "../cmd/init.js";
init();

const templatesDir = getTemplatesDir();

export const data = {
	pipelineType: ["github", "gitlab", "bitbucket", "azure", "drone", "jenkins"],
	dronePipelineType: ["docker", "kubernetes"],
	nodeVersion: ["16", "18", "19"],
	testType: ["api", "e2e"],
	testRunner: ["playwright", "puppeteer", "wdio"],
	npmPublishFileName: "npm-publish.yml",
	github: {
		templatePath: `${templatesDir}/github`,
	},
	gitlab: {
		templatePath: `${templatesDir}/gitlab`,
	},
	bitbucket: {
		templatePath: `${templatesDir}/bitbucket`,
	},
	azure: {
		templatePath: `${templatesDir}/azure`,
	},
	drone: {
		templatePath: `${templatesDir}/drone`,
	},
	jenkins: {
		templatePath: `${templatesDir}/jenkins`,
	},
	rome: {
		templatePath: `${templatesDir}/rome`,
	},
};
