const vscode = require('vscode');
class ProvideCompletionItem {
  public label;
  public kind;
  public documentation;
  public detail;
  constructor(label: string, desc: string, type = 'Module') {
    this.label = label;
    this.kind = vscode.CompletionItemKind[type];
    this.documentation = 'http-hub';
    this.detail = desc;
  }
}
export default ProvideCompletionItem