"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const index_1 = require("./utils/index");
const CompletionItems_1 = require("./utils/CompletionItems");
let modules = {};
function provideCompletionItems(document, position) {
    return new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
        const lineText = document.getText(new vscode.Range(position.with(undefined, 0), position)); // 匹配到当前行字符
        let moduleName;
        if (lineText.indexOf('$API') > -1) {
            const regex = /\$API\.(.+?)\./;
            const result = regex.exec(lineText);
            if (Array.isArray(result) && result.length > 1) {
                moduleName = result[1];
            }
        }
        if (lineText.indexOf('$API') > -1 && lineText.slice(-5, -1) === '$API') {
            const rootPath = index_1.default.getProjectRootPath(document);
            const config = vscode.workspace.getConfiguration('httphub');
            modules = index_1.default.getModules(`${rootPath}${config.modulePath || '/src/api/module'}`, {});
            let provide = [];
            Object.keys(modules).forEach(key => {
                provide.push(new CompletionItems_1.default(key, 'http-hub'));
            });
            return resolve(provide);
        }
        else if (lineText.indexOf('$API') > -1 && modules[moduleName] && modules[moduleName].length) {
            let provide = [];
            modules[moduleName].forEach(item => {
                provide.push(new CompletionItems_1.default(item.name, item.desc, 'Function'));
            });
            return resolve(provide);
        }
        else {
            return resolve([]);
        }
    }));
}
function activate(context) {
    console.log('Congratulations, your extension "http-hub-auto-code" is now active!');
    let showTime = vscode.commands.registerCommand('http-hub-auto-code.showTime', function () {
        const now = new Date().toDateString();
        vscode.window.showInformationMessage(now);
    });
    const fileType = ['javascript', 'vue', 'typescript'];
    fileType.forEach(item => {
        const provider = vscode.languages.registerCompletionItemProvider({
            scheme: 'file',
            language: item
        }, {
            provideCompletionItems: provideCompletionItems
        }, '.');
        context.subscriptions.push(provider);
    });
    context.subscriptions.push(showTime);
}
function deactivate() { }
module.exports = {
    activate,
    deactivate
};
//# sourceMappingURL=extension.js.map