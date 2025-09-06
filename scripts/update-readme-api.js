#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Extracts JSDoc comments from JavaScript files
 * @param {string} filePath - Path to the JavaScript file
 * @returns {Array} Array of JSDoc documentation objects
 */
function extractJSDocFromFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    const jsdocRegex = /\/\*\*\s*([\s\S]*?)\*\/\s*export\s+(?:async\s+)?function\s+(\w+)/g;
    const docs = [];
    let match;

    while ((match = jsdocRegex.exec(content)) !== null) {
        const [, comment, functionName] = match;
        
        // Parse JSDoc comment
        const lines = comment.split('\n').map(line => line.replace(/^\s*\*\s?/, '').trim()).filter(Boolean);
        
        let description = '';
        const params = [];
        let returns = '';
        let throws = '';
        
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            if (line.startsWith('@param')) {
                const paramMatch = line.match(/@param\s+\{([^}]+)\}\s+(\w+)\s*-?\s*(.*)/);
                if (paramMatch) {
                    params.push({
                        type: paramMatch[1],
                        name: paramMatch[2],
                        description: paramMatch[3]
                    });
                }
            } else if (line.startsWith('@returns') || line.startsWith('@return')) {
                const returnMatch = line.match(/@returns?\s+\{([^}]+)\}\s*-?\s*(.*)/);
                if (returnMatch) {
                    returns = `**Returns:** \`${returnMatch[1]}\` - ${returnMatch[2]}`;
                }
            } else if (line.startsWith('@throws')) {
                const throwMatch = line.match(/@throws\s+\{([^}]+)\}\s*-?\s*(.*)/);
                if (throwMatch) {
                    throws = `**Throws:** \`${throwMatch[1]}\` - ${throwMatch[2]}`;
                }
            } else if (!line.startsWith('@')) {
                description += (description ? ' ' : '') + line;
            }
        }

        docs.push({
            functionName,
            description,
            params,
            returns,
            throws,
            file: path.relative(process.cwd(), filePath)
        });
    }

    return docs;
}

/**
 * Generates markdown documentation from JSDoc comments
 * @returns {string} Markdown documentation
 */
function generateAPIDocumentation() {
    const files = [
        'utils/fileHelper.js',
        'utils/pipelinesHelper.js',
        'utils/romeHelper.js',
        'cmd/init.js'
    ];

    let markdown = '## API Documentation\n\n';
    markdown += 'This section provides detailed information about the Flowmatic API functions.\n\n';

    for (const file of files) {
        const filePath = path.join(process.cwd(), file);
        if (fs.existsSync(filePath)) {
            const docs = extractJSDocFromFile(filePath);
            if (docs.length > 0) {
                markdown += `### ${file}\n\n`;
                
                for (const doc of docs) {
                    markdown += `#### \`${doc.functionName}()\`\n\n`;
                    if (doc.description) {
                        markdown += `${doc.description}\n\n`;
                    }
                    
                    if (doc.params.length > 0) {
                        markdown += '**Parameters:**\n';
                        for (const param of doc.params) {
                            markdown += `- \`${param.name}\` (\`${param.type}\`) - ${param.description}\n`;
                        }
                        markdown += '\n';
                    }
                    
                    if (doc.returns) {
                        markdown += `${doc.returns}\n\n`;
                    }
                    
                    if (doc.throws) {
                        markdown += `${doc.throws}\n\n`;
                    }
                    
                    markdown += '---\n\n';
                }
            }
        }
    }

    return markdown;
}

/**
 * Updates the README.md file with generated API documentation
 */
function updateReadme() {
    const readmePath = path.join(process.cwd(), 'README.md');
    let content = fs.readFileSync(readmePath, 'utf8');
    
    const apiDoc = generateAPIDocumentation();
    
    // Find existing API documentation section and replace it
    const apiSectionRegex = /## API Documentation[\s\S]*?(?=##|\Z)/;
    
    if (apiSectionRegex.test(content)) {
        content = content.replace(apiSectionRegex, apiDoc);
    } else {
        // If no API section exists, append it
        content += '\n\n' + apiDoc;
    }
    
    fs.writeFileSync(readmePath, content, 'utf8');
    console.log('✅ README.md updated with API documentation');
}

// Run the script
updateReadme();