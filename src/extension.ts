import * as vscode from 'vscode';
import utils from './utils/index';
import ProvideCompletionItem from './utils/CompletionItems'
let modules = {}

function provideCompletionItems(document: vscode.TextDocument, position: vscode.Position): Promise<any[]> {
	return new Promise(async (resolve) => {
		const lineText = document.getText(new vscode.Range(position.with(undefined, 0), position)); // 匹配到当前行字符
		let moduleName;
		if (lineText.indexOf('$API') > -1) {
			const regex = /\$API\.(.+?)\./;
			const result = regex.exec(lineText)
			if (Array.isArray(result) && result.length > 1) {
				moduleName = result[1]
			}
		}
		if (lineText.indexOf('$API') > -1 && lineText.slice(-5, -1) === '$API') {
			const rootPath = utils.getProjectRootPath(document)
			const config = vscode.workspace.getConfiguration('httphub')
			modules = utils.getModules(`${rootPath}${config.modulePath || '/src/api/module'}`, {});
			let provide = []
			Object.keys(modules).forEach(key => {
				provide.push(new ProvideCompletionItem(key, 'http-hub'));
			})
			return resolve(provide);
		} else if (lineText.indexOf('$API') > -1 && modules[moduleName] && modules[moduleName].length) {
			let provide = []
			modules[moduleName].forEach(item => {
				provide.push(new ProvideCompletionItem(item.name, item.desc, 'Function'));
			})
			return resolve(provide);
		} else {
			return resolve([]);
		}
	});
}


function activate(context: vscode.ExtensionContext) {
	console.log('Congratulations, your extension "http-hub-auto-code" is now active!');
	let showTime = vscode.commands.registerCommand('http-hub-auto-code.showTime', function () {
		const now = new Date().toDateString()
		vscode.window.showInformationMessage(now);
	});
	const fileType = ['javascript', 'vue', 'typescript']
	fileType.forEach(item => {
		const provider = vscode.languages.registerCompletionItemProvider({
			scheme: 'file',
			language: item
		}, {
			provideCompletionItems: provideCompletionItems
		}, '.');
		context.subscriptions.push(provider);
	})

	context.subscriptions.push(showTime);
}

function deactivate() { }

module.exports = {
	activate,
	deactivate
}
