
import * as vscode from 'vscode';
import { generateGetx } from './getxgenerator';


export function activate(context: vscode.ExtensionContext) {
	let genGetX = vscode.commands.registerCommand('handy-flutter-module-generator.getx', (inUri: vscode.Uri) => generateGetx(inUri));

	context.subscriptions.push(genGetX);
}

// this method is called when your extension is deactivated
export function deactivate() {}
