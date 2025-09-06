[!["Buy Me A Coffee"](https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png)](https://www.buymeacoffee.com/peternguyew)

# Flowmatic CI/CD 🚀

**One command to create pipeline workflow files for your existing project.**

Flowmatic CICD is a powerful command-line tool that simplifies CI/CD pipeline setup across multiple platforms. Whether you're just starting with automation or looking to streamline your workflow creation process, Flowmatic eliminates the need to manually research and write pipeline configurations.

## ✨ Features

- 🎯 **Interactive CLI** - User-friendly prompts guide you through setup
- 🔒 **Security Hardened** - Input validation and sanitization built-in
- 🛤️ **Robust Path Resolution** - Works reliably across different environments
- 🧪 **Multiple Test Types** - Support for API and E2E testing
- 📦 **NPM Publishing** - Automated package publishing workflows
- 🎨 **Code Formatting** - Optional Rome integration for code quality
- ⚡ **Fast Setup** - Generate complete pipelines in seconds

## 🏗️ Supported CI/CD Platforms

| Platform | Status | Features |
|----------|---------|----------|
| **GitHub Actions** | ✅ | Workflows, NPM publish, multiple test runners |
| **GitLab CI** | ✅ | Complete pipeline support |
| **Bitbucket Pipelines** | ✅ | Full integration |
| **Azure DevOps** | ✅ | YAML pipelines |
| **DroneIO** | ✅ | Docker & Kubernetes support |
| **Jenkins** | ✅ | Jenkinsfile generation |

## 🚀 Quick Start

### Installation

```bash
npm install -g flowmatic-cicd
```

### Usage

Simply run the command in your project directory:

```bash
npx flowmatic-cicd
```

The interactive CLI will guide you through:
1. **Platform Selection** - Choose your CI/CD platform
2. **Test Configuration** - Select test type and runner
3. **Node.js Version** - Pick your preferred version
4. **Custom Commands** - Define your test commands
5. **Optional Features** - Rome formatter, NPM publishing

![Flowmatic Demo](http://g.recordit.co/SBPdCR261l.gif)

## 📋 Configuration Options

### Test Types
- **API Testing** - REST API testing pipelines
- **E2E Testing** - End-to-end testing with popular frameworks

### Test Runners (E2E)
- **Playwright** - Modern web testing
- **Puppeteer** - Chrome automation
- **WebDriverIO** - Cross-browser testing

### Node.js Versions
- Node.js 16, 18, 19

### Additional Features
- **Rome Integration** - Code formatting and linting
- **NPM Publishing** - Automated package releases (GitHub Actions)
- **Custom Test Commands** - Flexible command configuration

## 🔧 Advanced Usage

### Programmatic API

Flowmatic can also be used programmatically in your Node.js applications:

```javascript
import { createPipeline } from 'flowmatic-cicd/utils/pipelinesHelper.js';

await createPipeline({
  pipelineType: 'github',
  testType: 'e2e',
  testRunner: 'playwright',
  pipelinePath: './.github/workflows',
  fileName: 'ci.yml',
  nodeVersion: '18',
  runTestCommand: 'npm run test:e2e',
  npmPublish: false
});
```

### File Structure

After running Flowmatic, you'll get:

```
your-project/
├── .github/workflows/          # GitHub Actions (if selected)
│   ├── ci.yml                 # Main CI pipeline
│   └── npm-publish.yml        # NPM publish workflow (optional)
├── .gitlab-ci.yml             # GitLab CI (if selected)
├── bitbucket-pipelines.yml    # Bitbucket (if selected)
├── azure-pipelines.yml        # Azure DevOps (if selected)
├── .drone.yml                 # DroneIO (if selected)
├── jenkins/                   # Jenkins (if selected)
│   └── Jenkinsfile
└── rome.json                  # Rome config (if selected)
```

## 🛡️ Security & Reliability

Flowmatic includes enterprise-grade security features:

- **Input Validation** - All user inputs are validated and sanitized
- **Path Security** - Protection against directory traversal attacks
- **Template Verification** - Ensures template files exist before operations
- **Error Handling** - Comprehensive error handling with meaningful messages

## 🧪 Testing

Run the test suite:

```bash
npm test
```

Lint the code:

```bash
npm run code:lint
```

Generate documentation:

```bash
npm run docs:generate
```

Update README with latest API docs:

```bash
npm run docs:update-readme
```

## 📖 Examples

### Basic GitHub Actions Setup

```bash
npx flowmatic-cicd
# Select: GitHub Actions → E2E → Playwright → Node 18 → npm test
```

Generates:
```yaml
# .github/workflows/playwright-tests.yml
name: Playwright Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npm test
```

### GitLab CI with API Testing

```bash
npx flowmatic-cicd
# Select: GitLab → API → Node 18 → npm run test:api
```

Generates complete `.gitlab-ci.yml` with API testing configuration.

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Setup

1. Clone the repository
2. Install dependencies: `npm install`
3. Run tests: `npm test`
4. Lint code: `npm run code:lint`

### Reporting Issues

Please use the [GitHub Issues](https://github.com/kobenguyent/flowmatic/issues) page to report bugs or request features.

## 📄 License

ISC License - see [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Thanks to all contributors who have helped improve Flowmatic
- Inspired by the need to simplify CI/CD setup across platforms

## 📞 Support

- 📧 **Issues**: [GitHub Issues](https://github.com/kobenguyent/flowmatic/issues)
- ☕ **Support**: [Buy me a coffee](https://www.buymeacoffee.com/peternguyew)
- 📚 **Documentation**: Generated automatically from JSDoc comments

---

**Made with ❤️ by [peterngtr](https://github.com/peterngtr)**


## API Documentation

This section provides detailed information about the Flowmatic API functions.

### utils/fileHelper.js

#### `validatePath()`

Validates and sanitizes a file path

**Parameters:**
- `filePath` (`string`) - The file path to validate

**Returns:** `string` - The sanitized path

**Throws:** `Error` - If path is invalid or potentially dangerous

---

#### `validateFileName()`

Validates and sanitizes a file name

**Parameters:**
- `fileName` (`string`) - The file name to validate

**Returns:** `string` - The sanitized file name

---

### utils/pipelinesHelper.js

#### `pipelineTypeValidation()`

Validates pipeline type and returns normalized value

**Parameters:**
- `pipelineType` (`string`) - The pipeline type to validate

**Returns:** `string` - The validated and normalized pipeline type

**Throws:** `Error` - If pipeline type is not supported

---

#### `testRunnerValidation()`

Validates test runner and returns normalized value

**Parameters:**
- `testRunner` (`string`) - The test runner to validate

**Returns:** `string` - The validated and normalized test runner

**Throws:** `Error` - If test runner is not supported

---

### cmd/init.js

#### `getFlowmaticDir()`

Safely resolves the flowmatic directory path Checks multiple possible locations in order of preference

**Returns:** `string` - The resolved flowmatic directory path

---

#### `getTemplatesDir()`

Gets the templates directory path

**Returns:** `string` - The templates directory path

---

### utils/fileHelper.js

#### `validatePath()`

Validates and sanitizes a file path

**Parameters:**
- `filePath` (`string`) - The file path to validate

**Returns:** `string` - The sanitized path

**Throws:** `Error` - If path is invalid or potentially dangerous

---

#### `validateFileName()`

Validates and sanitizes a file name

**Parameters:**
- `fileName` (`string`) - The file name to validate

**Returns:** `string` - The sanitized file name

---

### utils/pipelinesHelper.js

#### `pipelineTypeValidation()`

Validates pipeline type and returns normalized value

**Parameters:**
- `pipelineType` (`string`) - The pipeline type to validate

**Returns:** `string` - The validated and normalized pipeline type

**Throws:** `Error` - If pipeline type is not supported

---

#### `testRunnerValidation()`

Validates test runner and returns normalized value

**Parameters:**
- `testRunner` (`string`) - The test runner to validate

**Returns:** `string` - The validated and normalized test runner

**Throws:** `Error` - If test runner is not supported

---

### cmd/init.js

#### `getFlowmaticDir()`

Safely resolves the flowmatic directory path Checks multiple possible locations in order of preference

**Returns:** `string` - The resolved flowmatic directory path

---

#### `getTemplatesDir()`

Gets the templates directory path

**Returns:** `string` - The templates directory path

---

