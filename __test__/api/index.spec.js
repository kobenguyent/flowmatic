import {
    getAvailableTemplates,
    validateConfiguration,
    generateWorkflowContent,
    generateWorkflowContentWithFileName
} from '../../api/index.js';
import { data } from '../../data/data.js';

describe('Public API Tests', () => {
    
    describe('getAvailableTemplates', () => {
        test('should return all available configurations', () => {
            const templates = getAvailableTemplates();
            
            expect(templates).toHaveProperty('pipelineTypes');
            expect(templates).toHaveProperty('testTypes');
            expect(templates).toHaveProperty('testRunners');
            expect(templates).toHaveProperty('nodeVersions');
            expect(templates).toHaveProperty('dronePipelineTypes');
            
            expect(templates.pipelineTypes).toEqual(data.pipelineType);
            expect(templates.testTypes).toEqual(data.testType);
            expect(templates.testRunners).toEqual(data.testRunner);
            expect(templates.nodeVersions).toEqual(data.nodeVersion);
            expect(templates.dronePipelineTypes).toEqual(data.dronePipelineType);
        });
    });

    describe('validateConfiguration', () => {
        test('should validate a valid configuration', () => {
            const config = {
                pipelineType: 'github',
                testType: 'api',
                nodeVersion: '18',
                runTestCommand: 'npm test'
            };
            
            const result = validateConfiguration(config);
            
            expect(result.pipelineType).toBe('github');
            expect(result.testType).toBe('api');
            expect(result.nodeVersion).toBe('18');
            expect(result.runTestCommand).toBe('npm test');
            expect(result.npmPublish).toBe(false);
        });

        test('should validate e2e configuration with test runner', () => {
            const config = {
                pipelineType: 'github',
                testType: 'e2e',
                testRunner: 'playwright',
                nodeVersion: '18',
                runTestCommand: 'npm run test:e2e'
            };
            
            const result = validateConfiguration(config);
            
            expect(result.pipelineType).toBe('github');
            expect(result.testType).toBe('e2e');
            expect(result.testRunner).toBe('playwright');
            expect(result.nodeVersion).toBe('18');
            expect(result.runTestCommand).toBe('npm run test:e2e');
        });

        test('should throw error when configuration is not an object', () => {
            expect(() => validateConfiguration(null)).toThrow('Configuration must be an object');
            expect(() => validateConfiguration('invalid')).toThrow('Configuration must be an object');
        });

        test('should throw error when pipelineType is missing', () => {
            const config = {
                testType: 'api'
            };
            
            expect(() => validateConfiguration(config)).toThrow('pipelineType is required');
        });

        test('should throw error when testType is missing', () => {
            const config = {
                pipelineType: 'github'
            };
            
            expect(() => validateConfiguration(config)).toThrow('testType is required');
        });

        test('should throw error when testRunner is missing for e2e tests', () => {
            const config = {
                pipelineType: 'github',
                testType: 'e2e'
            };
            
            expect(() => validateConfiguration(config)).toThrow('testRunner is required for e2e tests');
        });

        test('should throw error for unsupported pipeline type', () => {
            const config = {
                pipelineType: 'unsupported',
                testType: 'api'
            };
            
            expect(() => validateConfiguration(config)).toThrow('The passed pipeline type is not supported.');
        });

        test('should throw error for unsupported test type', () => {
            const config = {
                pipelineType: 'github',
                testType: 'unsupported'
            };
            
            expect(() => validateConfiguration(config)).toThrow("Test type 'unsupported' is not supported");
        });

        test('should throw error for unsupported test runner', () => {
            const config = {
                pipelineType: 'github',
                testType: 'e2e',
                testRunner: 'unsupported'
            };
            
            expect(() => validateConfiguration(config)).toThrow('The passed test runner is not supported.');
        });

        test('should throw error for unsupported node version', () => {
            const config = {
                pipelineType: 'github',
                testType: 'api',
                nodeVersion: '20'
            };
            
            expect(() => validateConfiguration(config)).toThrow("Node version '20' is not supported");
        });

        test('should throw error for empty run test command', () => {
            const config = {
                pipelineType: 'github',
                testType: 'api',
                runTestCommand: ''
            };
            
            expect(() => validateConfiguration(config)).toThrow('runTestCommand cannot be empty');
        });

        test('should set default values for optional parameters', () => {
            const config = {
                pipelineType: 'github',
                testType: 'api'
            };
            
            const result = validateConfiguration(config);
            
            expect(result.nodeVersion).toBe('18');
            expect(result.runTestCommand).toBe('npm test');
            expect(result.npmPublish).toBe(false);
        });

        test('should validate drone pipeline type', () => {
            const config = {
                pipelineType: 'drone',
                testType: 'api',
                dronePipelineType: 'docker'
            };
            
            const result = validateConfiguration(config);
            expect(result.dronePipelineType).toBe('docker');
        });

        test('should throw error for unsupported drone pipeline type', () => {
            const config = {
                pipelineType: 'drone',
                testType: 'api',
                dronePipelineType: 'unsupported'
            };
            
            expect(() => validateConfiguration(config)).toThrow("Drone pipeline type 'unsupported' is not supported");
        });
    });

    describe('generateWorkflowContent', () => {
        test('should generate API workflow for GitHub', () => {
            const config = {
                pipelineType: 'github',
                testType: 'api',
                nodeVersion: '18',
                runTestCommand: 'npm run test:api'
            };
            
            const result = generateWorkflowContent(config);
            
            expect(result.pipelineType).toBe('github');
            expect(result.testType).toBe('api');
            expect(result.files).toHaveLength(1);
            expect(result.files[0].name).toBe('workflow.yml');
            expect(result.files[0].content).toContain('name: Run Tests');
            expect(result.files[0].content).toContain('node-version: 18');
            expect(result.files[0].content).toContain('npm run test:api');
            expect(result.files[0].description).toContain('Main api workflow for github');
        });

        test('should generate E2E workflow for GitHub with Playwright', () => {
            const config = {
                pipelineType: 'github',
                testType: 'e2e',
                testRunner: 'playwright',
                nodeVersion: '18',
                runTestCommand: 'npm run test:e2e'
            };
            
            const result = generateWorkflowContent(config);
            
            expect(result.pipelineType).toBe('github');
            expect(result.testType).toBe('e2e');
            expect(result.files).toHaveLength(1);
            expect(result.files[0].name).toBe('workflow.yml');
            expect(result.files[0].content).toContain('name: Run Tests');
            expect(result.files[0].content).toContain('node-version: 18');
            expect(result.files[0].content).toContain('npm run test:e2e');
            expect(result.files[0].content).toContain('npx playwright install-deps');
        });

        test('should generate workflow with npm publish for GitHub', () => {
            const config = {
                pipelineType: 'github',
                testType: 'api',
                nodeVersion: '18',
                runTestCommand: 'npm test',
                npmPublish: true
            };
            
            const result = generateWorkflowContent(config);
            
            expect(result.pipelineType).toBe('github');
            expect(result.testType).toBe('api');
            expect(result.files).toHaveLength(2);
            
            // Check main workflow
            expect(result.files[0].name).toBe('workflow.yml');
            expect(result.files[0].description).toContain('Main api workflow for github');
            
            // Check npm publish workflow
            expect(result.files[1].name).toBe('npm-publish.yml');
            expect(result.files[1].description).toContain('NPM publish workflow');
        });

        test('should generate Bitbucket workflow', () => {
            const config = {
                pipelineType: 'bitbucket',
                testType: 'api',
                nodeVersion: '18',
                runTestCommand: 'npm test'
            };
            
            const result = generateWorkflowContent(config);
            
            expect(result.pipelineType).toBe('bitbucket');
            expect(result.testType).toBe('api');
            expect(result.files).toHaveLength(1);
            expect(result.files[0].name).toBe('bitbucket-pipelines.yml');
        });

        test('should generate GitLab E2E workflow', () => {
            const config = {
                pipelineType: 'gitlab',
                testType: 'e2e',
                testRunner: 'playwright',
                nodeVersion: '18',
                runTestCommand: 'npm test'
            };
            
            const result = generateWorkflowContent(config);
            
            expect(result.pipelineType).toBe('gitlab');
            expect(result.testType).toBe('e2e');
            expect(result.files).toHaveLength(1);
            expect(result.files[0].name).toBe('.gitlab-ci.yml');
        });

        test('should generate Azure workflow', () => {
            const config = {
                pipelineType: 'azure',
                testType: 'api',
                nodeVersion: '18',
                runTestCommand: 'npm test'
            };
            
            const result = generateWorkflowContent(config);
            
            expect(result.pipelineType).toBe('azure');
            expect(result.testType).toBe('api');
            expect(result.files).toHaveLength(1);
            expect(result.files[0].name).toBe('azure-pipelines.yml');
        });

        test('should throw error for invalid configuration', () => {
            const config = {
                pipelineType: 'invalid',
                testType: 'api'
            };
            
            expect(() => generateWorkflowContent(config)).toThrow('The passed pipeline type is not supported.');
        });
    });

    describe('generateWorkflowContentWithFileName', () => {
        test('should generate workflow with custom file name', () => {
            const config = {
                pipelineType: 'github',
                testType: 'api',
                nodeVersion: '18',
                runTestCommand: 'npm test'
            };
            
            const result = generateWorkflowContentWithFileName(config, 'custom-workflow');
            
            expect(result.files).toHaveLength(1);
            expect(result.files[0].name).toBe('custom-workflow.yml');
            expect(result.files[0].content).toContain('name: Run Tests');
        });

        test('should handle file name that already has .yml extension', () => {
            const config = {
                pipelineType: 'github',
                testType: 'api',
                nodeVersion: '18',
                runTestCommand: 'npm test'
            };
            
            const result = generateWorkflowContentWithFileName(config, 'custom-workflow.yml');
            
            expect(result.files).toHaveLength(1);
            expect(result.files[0].name).toBe('custom-workflow.yml');
        });

        test('should throw error when file name is missing', () => {
            const config = {
                pipelineType: 'github',
                testType: 'api'
            };
            
            expect(() => generateWorkflowContentWithFileName(config, null)).toThrow('fileName is required');
            expect(() => generateWorkflowContentWithFileName(config, '')).toThrow('fileName is required');
        });

        test('should sanitize dangerous file name', () => {
            const config = {
                pipelineType: 'github',
                testType: 'api',
                nodeVersion: '18',
                runTestCommand: 'npm test'
            };
            
            const result = generateWorkflowContentWithFileName(config, 'dangerous/file<name>');
            
            expect(result.files).toHaveLength(1);
            expect(result.files[0].name).toBe('dangerousfilename.yml');
        });
    });
});