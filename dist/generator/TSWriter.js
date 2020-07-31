"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TSWriter = void 0;
const fs_1 = __importDefault(require("fs"));
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
async function TSWriter(file, code) {
    const x = await typescript_formatter_1.processString(file, code.trim() + '\n', formatterOptions);
    fs_1.default.writeFileSync(file, x.dest);
}
exports.TSWriter = TSWriter;
