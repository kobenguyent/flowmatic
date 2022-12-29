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

    })
})
