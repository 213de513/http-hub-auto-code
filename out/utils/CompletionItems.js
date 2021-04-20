"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require('vscode');
class ProvideCompletionItem {
    constructor(label, desc, type = 'Module') {
        this.label = label;
        this.kind = vscode.CompletionItemKind[type];
        this.documentation = 'http-hub';
        this.detail = desc;
    }
}
exports.default = ProvideCompletionItem;
