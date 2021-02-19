import * as vscode from 'vscode';
import { pascalize } from '../utils/stringutils';
import fs = require('fs');

export async function createNewWidget(inUri: vscode.Uri) {
    const nameOpts: vscode.InputBoxOptions = {
        prompt: "New Widget name (LOWERCASE)",
        validateInput: async (value) => {
            return /^[a-z ]+$/g.test(value) ? null : "It is not a valid widget name !";
        }
    };
    const name = await vscode.window.showInputBox(nameOpts);
    if (name === undefined) {
        return vscode.window.showErrorMessage("Aborted");
    }

    const nameWithUnderScore = name.replace(" ", "_");

    const widgetFilename = `/${nameWithUnderScore}.dart`;

    const path = inUri.path + widgetFilename;
    const options = { flag: 'wx' };


    fs.writeFileSync(path, screenContent(name), options);

    vscode.workspace.openTextDocument(path).then(doc => {
        vscode.window.showTextDocument(doc);
    });
    return vscode.window.showInformationMessage("Succes");
}



function screenContent(name: String) {
    const widget = pascalize(name);
    const content = `
import 'package:flutter/material.dart';

class ${widget} extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Container();
  }
}`;


    return content;
}