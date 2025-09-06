# Contributing to Flowmatic CI/CD

We love your input! We want to make contributing to Flowmatic as easy and transparent as possible, whether it's:

- Reporting a bug
- Discussing the current state of the code
- Submitting a fix
- Proposing new features
- Becoming a maintainer

## Development Process

We use GitHub to host code, to track issues and feature requests, as well as accept pull requests.

## Pull Requests

Pull requests are the best way to propose changes to the codebase. We actively welcome your pull requests:

1. Fork the repo and create your branch from `main`.
2. If you've added code that should be tested, add tests.
3. If you've changed APIs, update the documentation.
4. Ensure the test suite passes.
5. Make sure your code lints.
6. Issue that pull request!

## Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/kobenguyent/flowmatic.git
   cd flowmatic
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run tests**
   ```bash
   npm test
   ```

4. **Lint code**
   ```bash
   npm run code:lint
   ```

5. **Update documentation**
   ```bash
   npm run docs:update-readme
   ```

## Code Style

- We use Rome for linting and formatting
- Run `npm run code:lint` before committing
- Follow existing code patterns and conventions
- Add JSDoc comments for new functions

## Testing

- Write tests for new functionality
- Ensure all tests pass before submitting PR
- Test coverage should be maintained or improved
- Test both success and error cases

## Documentation

- Update JSDoc comments for any API changes
- Run `npm run docs:update-readme` to update API documentation
- Update README.md for any user-facing changes
- Include examples for new features

## Adding New CI/CD Platforms

To add support for a new CI/CD platform:

1. **Add platform to data**
   - Update `data/data.js` with new platform configuration
   - Add platform to `pipelineType` array

2. **Create templates**
   - Add template files in `templates/<platform>/`
   - Follow existing template patterns
   - Include both API and E2E test variants

3. **Update validation**
   - Ensure platform is included in validation logic
   - Add appropriate error handling

4. **Add tests**
   - Create tests for the new platform
   - Test template generation and file operations

5. **Update documentation**
   - Add platform to README.md supported platforms table
   - Update examples if needed

## Bug Reports

We use GitHub issues to track public bugs. Report a bug by [opening a new issue](https://github.com/kobenguyent/flowmatic/issues/new).

**Great Bug Reports** tend to have:

- A quick summary and/or background
- Steps to reproduce
  - Be specific!
  - Give sample code if you can
- What you expected would happen
- What actually happens
- Notes (possibly including why you think this might be happening, or stuff you tried that didn't work)

## Feature Requests

We welcome feature requests! Please provide:

- **Use case**: Describe the problem this feature would solve
- **Proposed solution**: How you envision this working
- **Alternatives**: Other solutions you've considered
- **Additional context**: Any other context or screenshots

## Security

If you find a security vulnerability, please email the maintainers directly instead of opening a public issue.

## License

By contributing, you agree that your contributions will be licensed under the ISC License.

## Questions?

Feel free to open an issue for questions or reach out to the maintainers.

## Recognition

Contributors are automatically added to our [GitHub contributors list](https://github.com/kobenguyent/flowmatic/graphs/contributors).

Thank you for contributing! 🎉