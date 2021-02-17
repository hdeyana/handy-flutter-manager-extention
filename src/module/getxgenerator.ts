import { UserInputModel } from '../data/model/userinputmodel';
import * as vscode from 'vscode';
import * as mkdirp from 'mkdirp';
import fs = require('fs');
import { camelize } from '../utils/stringutils';
import { getUserInput } from '../utils/getuserinputformodule';
import { foldersConstant } from '../data/constant/folders';



export async function generateGetx(inUri: vscode.Uri | undefined) {
    let data:UserInputModel;
    try {
        data = await getUserInput(inUri);
    } catch (error) {
        return vscode.window.showErrorMessage((error as Error).message);
    }
  
    await generateGetxFolders(data.uri, data.name, data.isAlreadyInit);
    vscode.window.showInformationMessage("Successfully created new MODULE " + camelize(data.name));
}




async function generateGetxFolders(uri: vscode.Uri, name: string, isAlreadyInit: boolean) {
    const nameWithoutSpace = name.replace(" ", "");

    const d = uri.path + "/" + nameWithoutSpace;
    await mkdirp(d);

    const folders = foldersConstant;

    folders.push('/controller');

    const options = { flag: 'wx' };

    for (const data of folders) {
        const newp = d + data;

        await mkdirp(newp);

        if (data === '/controller') {
            const controllerFileName = `${newp}/${nameWithoutSpace}controller.dart`;
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

