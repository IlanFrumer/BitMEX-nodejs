import fs from 'fs';
import { processString } from 'typescript-formatter';

const formatterOptions = {
    baseDir: __dirname,
    editorconfig: false,
    replace: false,
    tsconfig: false,
    tsconfigFile: null,
    tsfmt: true,
    tsfmtFile: null,
    tslint: false,
    tslintFile: null,
    verify: false,
    vscode: false,
    vscodeFile: null
};

export async function TSWriter(file: string, code: string) {
    const x = await processString(file, code.trim() + '\n', formatterOptions);
    fs.writeFileSync(file, x.dest);
}
