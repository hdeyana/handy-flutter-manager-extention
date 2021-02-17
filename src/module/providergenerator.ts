import { UserInputModel } from '../data/model/userinputmodel';
import * as vscode from 'vscode';
import * as mkdirp from 'mkdirp';
import fs = require('fs');
import { camelize } from '../utils/stringutils';
import { getUserInput } from '../utils/getuserinputformodule';
import { foldersConstant } from '../data/constant/folders';



export async function generateProvider(inUri: vscode.Uri | undefined) {
    let data: UserInputModel;
    try {
        data = await getUserInput(inUri);
    } catch (error) {
        return vscode.window.showErrorMessage((error as Error).message);
    }

    await generateProviderForders(data.uri, data.name, data.isAlreadyInit);
    vscode.window.showInformationMessage("Successfully created new MODULE " + camelize(data.name));
}



async function generateProviderForders(uri: vscode.Uri, name: string, isAlreadyInit: boolean) {
    const nameWithoutSpace = name.replace(" ", "");

    const d = uri.path + "/" + nameWithoutSpace;
    await mkdirp(d);

    const folders = foldersConstant;
    folders.push('/provider');


    const options = { flag: 'wx' };
    for (const data of folders) {
        const newp = d + data;

        await mkdirp(newp);

        if (data === '/provider') {
            const controllerFileName = `${newp}/${nameWithoutSpace}provider.dart`;
            fs.writeFileSync(controllerFileName, controllerContent(name), options);
        }

        if (data === '/screen') {
            const screenFileName = `${newp}/${nameWithoutSpace}screen.dart`;
            fs.writeFileSync(screenFileName, screenContent(name, isAlreadyInit), options);
        }
    }


}

function controllerContent(name: String) {
    const camel = camelize(name);
    const content = `
import 'package:flutter/foundation.dart';

class ${camel}Provider extends ChangeNotifier {}`;

    return content;
}


function screenContent(name: String, isAlreadyInit: boolean) {
    const camel = camelize(name);
    const content = `
import 'package:flutter/material.dart';

class ${camel}Screen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold();
  }
}`;

    const contentWithInit = `
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

class ${camel}Screen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return ChangeNotifierProvider<${camel}Provider>(
      create: ${camel}Provider(),
      builder: (context, widget) {
        return Scaffold();
      },
    );
  }
}`;

    return isAlreadyInit ? content : contentWithInit;
}
