import * as vscode from 'vscode';
import { camelize } from '../utils/stringutils';
import fs = require('fs');

export async function createNewWidget(inUri: vscode.Uri) {
    const nameOpts: vscode.InputBoxOptions = {
        prompt: "New Module Name (LOWERCASE)",
        validateInput: async (value) => {
            return /^[a-z ]+$/g.test(value) ? null : "It is not a valid widget name !";
        }

    };
    const name = await vscode.window.showInputBox(nameOpts);
    if (name === undefined) {
        return vscode.window.showErrorMessage("Aborted");
    }

    const nameWithoutSpace = name.replace(" ", "");
    const widgetFilename = `/${nameWithoutSpace}.dart`;

    const path = inUri.path + widgetFilename;
    const options = { flag: 'wx' };


    fs.writeFileSync(path, screenContent(nameWithoutSpace), options);

    return vscode.window.showInformationMessage("Succes");
}



function screenContent(name: String) {
    const camel = camelize(name);
    const content = `
import 'package:flutter/material.dart';

class ${camel} extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Container();
  }
}`;


    return  content ;
}