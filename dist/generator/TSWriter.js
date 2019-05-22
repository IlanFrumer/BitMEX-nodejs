"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const fs_1 = tslib_1.__importDefault(require("fs"));
const typescript_formatter_1 = require("typescript-formatter");
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
function TSWriter(file, code) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const x = yield typescript_formatter_1.processString(file, code.trim() + '\n', formatterOptions);
        fs_1.default.writeFileSync(file, x.dest);
    });
}
exports.TSWriter = TSWriter;
