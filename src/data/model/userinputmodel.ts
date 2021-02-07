import * as vscode from 'vscode';

export interface UserInputModel {
    name:string,
    isAlreadyInit:boolean,
    uri: vscode.Uri,
}