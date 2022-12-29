import run from 'inquirer-test';
import path from 'path';
import { DOWN, ENTER } from 'inquirer-test';

const runner = path.join(process.cwd(), './bin/index.js');

describe('Flowmatic CLI', () => {
    describe('flows', () => {
        test('should see welcome message', async () => {
            const result = await run([runner], []);
            expect(result).toContain('Pipeline Creation at ease - supporting');
        })

        test('should see Which CI/CD are you currently using?', async () => {
            const result = await run([runner], []);
            expect(result).toContain('Which CI/CD are you currently using?');
        })

        test('should see Which Node version do you want to use?', async () => {
            const result = await run([runner], [ENTER]);
            expect(result).toContain('Which Node version do you want to use?');
        })

        test('should see Which type of tests are you implementing?', async () => {
            const result = await run([runner], [ENTER, ENTER]);
            expect(result).toContain('Which type of tests are you implementing?');
        })

        test('should see Which type of tests are you implementing?', async () => {
            const result = await run([runner], [ENTER, ENTER, ENTER]);
            expect(result).toContain('How do you name your workflow file?');
        })

        test('should see What is your command to run tests?', async () => {
            const result = await run([runner], [ENTER, ENTER, ENTER, ENTER]);
            expect(result).toContain('What is your command to run tests?');
        })

        test('should see Which test runner are you using?', async () => {
            const result = await run([runner], [ENTER, ENTER, DOWN, ENTER]);
            expect(result).toContain('Which test runner are you using?');
        })
    })
})
