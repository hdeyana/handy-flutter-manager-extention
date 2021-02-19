import * as vscode from 'vscode';
import { createNewWidget } from './module/createnewwidget';
import { generateGetx } from './module/getxgenerator';
import { generateProvider } from './module/providergenerator';


export function activate(context: vscode.ExtensionContext) {
	const genGetX = vscode.commands.registerCommand('handy-flutter-manager.getx', (inUri: vscode.Uri) => generateGetx(inUri));
	const genProvider = vscode.commands.registerCommand('handy-flutter-manager.provider', (inUri: vscode.Uri) => generateProvider(inUri));
	const genWidget = vscode.commands.registerCommand('handy-flutter-manager.widget', (inUri: vscode.Uri) => createNewWidget(inUri));

	context.subscriptions.push(genGetX, genProvider, genWidget);
}

// this method is called when your extension is deactivated
export function deactivate() { }
