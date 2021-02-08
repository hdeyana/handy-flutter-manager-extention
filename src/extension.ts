
import * as vscode from 'vscode';
import { generateGetx } from './getxgenerator';
import { generateProvider } from './providergenerator';


export function activate(context: vscode.ExtensionContext) {
	const genGetX = vscode.commands.registerCommand('handy-flutter-module-generator.getx', (inUri: vscode.Uri) => generateGetx(inUri));
	const genProvider = vscode.commands.registerCommand('handy-flutter-module-generator.provider', (inUri: vscode.Uri) => generateProvider(inUri));

	context.subscriptions.push(genGetX, genProvider);
}

// this method is called when your extension is deactivated
export function deactivate() {}
