/**
 * Public API for Flowmatic CI/CD
 * Exposes functions to generate workflow content programmatically
 */

import fs from 'fs';
import path from 'path';
import { data } from '../data/data.js';
import { 
    pipelineTypeValidation, 
    testRunnerValidation 
} from '../utils/pipelinesHelper.js';
import { validateFileName } from '../utils/fileHelper.js';

/**
 * Get available templates and configurations
 * @returns {Object} Available configurations for all supported platforms
 */
export function getAvailableTemplates() {
    return {
        pipelineTypes: data.pipelineType,
        testTypes: data.testType,
        testRunners: data.testRunner,
        nodeVersions: data.nodeVersion,
        dronePipelineTypes: data.dronePipelineType
    };
}

/**
 * Validate configuration parameters
 * @param {Object} config - Configuration object
 * @param {string} config.pipelineType - Type of CI/CD platform
 * @param {string} config.testType - Type of test (api or e2e)
 * @param {string} [config.testRunner] - Test runner (required for e2e tests)
 * @param {string} [config.nodeVersion] - Node.js version
 * @param {string} [config.runTestCommand] - Command to run tests
 * @param {string} [config.dronePipelineType] - Drone pipeline type
 * @param {boolean} [config.npmPublish] - Whether to include npm publish workflow
 * @returns {Object} Validated and normalized configuration
 * @throws {Error} If configuration is invalid
 */
export function validateConfiguration(config) {
    if (!config || typeof config !== 'object') {
        throw new Error('Configuration must be an object');
    }

    const {
        pipelineType,
        testType,
        testRunner,
        nodeVersion = '18',
        runTestCommand = 'npm test',
        dronePipelineType,
        npmPublish = false
    } = config;

    // Validate required parameters
    if (!pipelineType) {
        throw new Error('pipelineType is required');
    }

    if (!testType) {
        throw new Error('testType is required');
    }

    // Validate pipeline type
    const validatedPipelineType = pipelineTypeValidation(pipelineType);

    // Validate test type
    const normalizedTestType = testType.toLowerCase();
    if (!data.testType.includes(normalizedTestType)) {
        throw new Error(`Test type '${testType}' is not supported. Supported types: ${data.testType.join(', ')}`);
    }

    // Validate test runner for e2e tests
    let validatedTestRunner = null;
    if (normalizedTestType === 'e2e') {
        if (!testRunner) {
            throw new Error('testRunner is required for e2e tests');
        }
        validatedTestRunner = testRunnerValidation(testRunner);
    }

    // Validate node version
    if (nodeVersion && !data.nodeVersion.includes(nodeVersion)) {
        throw new Error(`Node version '${nodeVersion}' is not supported. Supported versions: ${data.nodeVersion.join(', ')}`);
    }

    // Validate drone pipeline type if specified
    if (validatedPipelineType === 'drone' && dronePipelineType) {
        if (!data.dronePipelineType.includes(dronePipelineType)) {
            throw new Error(`Drone pipeline type '${dronePipelineType}' is not supported. Supported types: ${data.dronePipelineType.join(', ')}`);
        }
    }

    // Validate run test command
    if (!runTestCommand || runTestCommand.trim().length === 0) {
        throw new Error('runTestCommand cannot be empty');
    }

    return {
        pipelineType: validatedPipelineType,
        testType: normalizedTestType,
        testRunner: validatedTestRunner,
        nodeVersion,
        runTestCommand: runTestCommand.trim(),
        dronePipelineType,
        npmPublish: Boolean(npmPublish)
    };
}

/**
 * Read and process a template file
 * @param {string} templatePath - Path to the template file
 * @param {Object} replacements - Key-value pairs for template replacement
 * @returns {string} Processed template content
 * @throws {Error} If template file doesn't exist or cannot be read
 */
function processTemplate(templatePath, replacements = {}) {
    if (!fs.existsSync(templatePath)) {
        throw new Error(`Template file not found: ${templatePath}`);
    }

    let content = fs.readFileSync(templatePath, 'utf8');
    
    // Replace placeholders in the template
    for (const [key, value] of Object.entries(replacements)) {
        const regex = new RegExp(key, 'g');
        content = content.replace(regex, value);
    }

    return content;
}

/**
 * Generate workflow content for a specific configuration
 * @param {Object} config - Configuration object
 * @param {string} config.pipelineType - Type of CI/CD platform
 * @param {string} config.testType - Type of test (api or e2e)
 * @param {string} [config.testRunner] - Test runner (required for e2e tests)
 * @param {string} [config.nodeVersion] - Node.js version
 * @param {string} [config.runTestCommand] - Command to run tests
 * @param {string} [config.dronePipelineType] - Drone pipeline type
 * @param {boolean} [config.npmPublish] - Whether to include npm publish workflow
 * @returns {Object} Generated workflow content
 * @throws {Error} If configuration is invalid or template processing fails
 */
export function generateWorkflowContent(config) {
    // Validate configuration
    const validatedConfig = validateConfiguration(config);
    
    const {
        pipelineType,
        testType,
        testRunner,
        nodeVersion,
        runTestCommand,
        dronePipelineType,
        npmPublish
    } = validatedConfig;

    const templatePath = data[pipelineType].templatePath;
    const results = {
        pipelineType,
        testType,
        files: []
    };

    // Prepare template replacements
    const replacements = {
        'nodeVersion': nodeVersion,
        'runTestCommand': runTestCommand
    };

    if (dronePipelineType) {
        replacements['dronePipelineType'] = dronePipelineType;
    }

    try {
        // Generate main workflow file
        let mainTemplateFile;
        let mainFileName;

        if (testType === 'api') {
            // API test workflow
            if (pipelineType === 'jenkins') {
                mainTemplateFile = path.join(templatePath, 'api');
                mainFileName = 'Jenkinsfile';
            } else {
                mainTemplateFile = path.join(templatePath, 'api.yml');
                mainFileName = getDefaultFileName(pipelineType);
            }
        } else {
            // E2E test workflow
            if (pipelineType === 'jenkins') {
                mainTemplateFile = path.join(templatePath, testRunner);
                mainFileName = 'Jenkinsfile';
            } else {
                mainTemplateFile = path.join(templatePath, `${testRunner}.yml`);
                mainFileName = getDefaultFileName(pipelineType);
            }
        }

        const mainContent = processTemplate(mainTemplateFile, replacements);
        results.files.push({
            name: mainFileName,
            content: mainContent,
            description: `Main ${testType} workflow for ${pipelineType}`
        });

        // Generate npm publish workflow if requested (GitHub only)
        if (npmPublish && pipelineType === 'github') {
            const publishTemplateFile = path.join(templatePath, data.npmPublishFileName);
            if (fs.existsSync(publishTemplateFile)) {
                const publishContent = processTemplate(publishTemplateFile, replacements);
                results.files.push({
                    name: data.npmPublishFileName,
                    content: publishContent,
                    description: 'NPM publish workflow'
                });
            }
        }

        return results;

    } catch (error) {
        throw new Error(`Failed to generate workflow content: ${error.message}`);
    }
}

/**
 * Get default file name for a pipeline type
 * @param {string} pipelineType - Type of CI/CD platform
 * @returns {string} Default file name
 */
function getDefaultFileName(pipelineType) {
    const fileNames = {
        'github': 'workflow.yml',
        'gitlab': '.gitlab-ci.yml',
        'bitbucket': 'bitbucket-pipelines.yml',
        'azure': 'azure-pipelines.yml',
        'drone': '.drone.yml',
        'jenkins': 'Jenkinsfile'
    };

    return fileNames[pipelineType] || 'workflow.yml';
}

/**
 * Generate workflow content with custom file name (GitHub only)
 * @param {Object} config - Configuration object (same as generateWorkflowContent)
 * @param {string} fileName - Custom file name for the workflow
 * @returns {Object} Generated workflow content with custom file name
 * @throws {Error} If configuration is invalid or file name is invalid
 */
export function generateWorkflowContentWithFileName(config, fileName) {
    if (!fileName) {
        throw new Error('fileName is required');
    }

    // Validate and sanitize file name
    const sanitizedFileName = validateFileName(fileName);
    
    // Generate content using the main function
    const result = generateWorkflowContent(config);
    
    // Update the file name for the main workflow file (first file)
    if (result.files.length > 0) {
        result.files[0].name = sanitizedFileName.endsWith('.yml') ? sanitizedFileName : `${sanitizedFileName}.yml`;
    }
    
    return result;
}