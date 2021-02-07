import * as vscode from 'vscode';
import * as mkdirp from 'mkdirp';
import fs = require('fs');

interface BooleanQuickPickItem extends vscode.QuickPickItem { value: boolean }

export async function generateGetx(inUri: vscode.Uri | undefined) {
    // The code you place here will be executed every time your command is executed

    // Display a message box to the user
    const nameOpts: vscode.InputBoxOptions = {
        prompt: "New Module Name",
        validateInput: async (value) => {
            return /^[0-9a-z]+$/g.test(value) ? null : "It is not a valid module name !";
        }

    };
    const name = await vscode.window.showInputBox(nameOpts);
    if (name === undefined) {
        vscode.window.showErrorMessage("Aborted");
        return;
    }

    const isInit: readonly BooleanQuickPickItem[] = await new Promise((res) => {
        const quickpick = vscode.window.createQuickPick<BooleanQuickPickItem>();
        const items = [{ label: "Yes", value: true }, { label: "No", value: false }];
        quickpick.title = "Is Controller has been initialized before?";
        quickpick.items = items;
        quickpick.onDidAccept(() => quickpick.hide());
        quickpick.onDidHide(() => { res(quickpick.selectedItems); quickpick.dispose(); });
        quickpick.show();
    });

    if (isInit === undefined || isInit.length === 0) {
        vscode.window.showErrorMessage("Aborted");
        return;
    }
    const openOpts: vscode.OpenDialogOptions = { canSelectMany: false, canSelectFiles: false, canSelectFolders: true };

    var uri: vscode.Uri;

    if (inUri === undefined) {
        const userUri = await vscode.window.showOpenDialog(openOpts);
        if (userUri === undefined) {
            vscode.window.showErrorMessage("Aborted");
            return;
        }
        uri = userUri[0];
    } else {
        uri = inUri;
    }



    await generateGetxFolders(uri, name, isInit[0].value);
    vscode.window.showInformationMessage("Successfully created new module " + camelize(name));
}




async function generateGetxFolders(uri: vscode.Uri, name: string, isAlreadyInit: boolean) {
    const d = uri.path + "/" + name;
    await mkdirp(d);

    const folders = ['/screen', '/controller', '/widget', '/data', '/data/model', '/data/repo', '/data/service', '/data/constant'];

    for (const data of folders) {
        const newp = d + data;

        await mkdirp(newp);

        if (data === '/controller') {
            const controllerFileName = `${newp}/${name}controller.dart`;
            fs.writeFileSync(controllerFileName, controllerContent(name));
        }

        if (data === '/screen') {
            const screenFileName = `${newp}/${name}screen.dart`;
            fs.writeFileSync(screenFileName, screenContent(name, isAlreadyInit));
        }
    }


}

function controllerContent(name: String) {
    const camel = camelize(name);
    const content = `
import 'package:get/get.dart';

class ${camel}Controller extends GetxController {}`;

    return content;
}


function screenContent(name: String, isAlreadyInit: boolean) {
    const camel = camelize(name);
    const content = `
import 'package:flutter/material.dart';
import 'package:get/get.dart';

class ${camel}Screen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return GetBuilder<${camel}Controller>(
      builder: (${name}ontroller) {
        return Scaffold();
      },
    );
  }
}`;

    const contentWithInit = `
import 'package:flutter/material.dart';
import 'package:get/get.dart';

class ${camel}Screen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return GetBuilder<${camel}Controller>(
      init: ${camel}Controller(),
      builder: (${name}ontroller) {
        return Scaffold();
      },
    );
  }
}`;

    return isAlreadyInit ? content : contentWithInit;
}

function camelize(str: String) {
    return str.replace(/^([a-z])|((?:[\s_])[a-z])/g, function (match, _index) {
        if (+match === 0) { return ""; } // or if (/\s+/.test(match)) for white spaces
        return match.toUpperCase().replace(/[\s_]/g, (_, __) => "");
    });
}
