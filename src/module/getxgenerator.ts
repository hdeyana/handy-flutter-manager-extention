import { UserInputModel } from '../data/model/userinputmodel';
import * as vscode from 'vscode';
import * as mkdirp from 'mkdirp';
import fs = require('fs');
import { camelize, pascalize } from '../utils/stringutils';
import { getUserInput } from '../utils/getuserinputformodule';
import { foldersConstant } from '../data/constant/folders';



export async function generateGetx(inUri: vscode.Uri | undefined) {
  let data: UserInputModel;
  try {
    data = await getUserInput(inUri);
  } catch (error) {
    return vscode.window.showErrorMessage((error as Error).message);
  }

  await generateGetxFolders(data.uri, data.name, data.isAlreadyInit);
  vscode.window.showInformationMessage("Successfully created new MODULE " + camelize(data.name));
}




async function generateGetxFolders(uri: vscode.Uri, name: string, isAlreadyInit: boolean) {
  const nameWithoutSpace = name.replace(" ", "_");

  const d = uri.path + "/" + camelize(name);
  await mkdirp(d);

  const folders = foldersConstant;

  folders.push('/controller');

  const options = { flag: 'wx' };

  for (const data of folders) {
    const newp = d + data;

    await mkdirp(newp);

    if (data === '/controller') {
      const file = `${newp}/${nameWithoutSpace}_controller.dart`;
      fs.writeFileSync(file, controllerContent(name), options);
    }

    if (data === '/screen') {
      const file = `${newp}/${nameWithoutSpace}_screen.dart`;
      fs.writeFileSync(file, screenContent(name, isAlreadyInit), options);
    }

    if (data === '/data/repo') {
      const file = `${newp}/${nameWithoutSpace}_repo.dart`;
      fs.writeFileSync(file, repoContent(name), options);
    }

    if (data === '/data/service') {
      const file = `${newp}/${nameWithoutSpace}_service.dart`;
      fs.writeFileSync(file, serviceContent(name), options);
    }
  }


}

function controllerContent(name: String) {
  const co = pascalize(name);
  const content = `
import 'package:get/get.dart';

class ${co}Controller extends GetxController with ${co}Repo {

}`;

  return content;
}


function repoContent(name: String) {
  const co = pascalize(name);
  const content = `
// //Example of Repo
// //You might not use it
//abstract class ${co}Repo {
//   // final _myService = ${co}Service();

//   // Every function should have repo as prefix

//   Future<void> repoFunc() async {
//     try {
//       servFunc();
//     } catch (e) {
//       rethrow;
//     }
//   }

//   Stream<Object> repoAnotherFunc() async* {}
// }
`;

  return content;
}


function serviceContent(name: String) {
  const co = pascalize(name);
  const content = `
// //Example Of Service
// //You migh not use it
// class ${co}Service {
//   Future<void> servFunc() async {}
// }

`;

  return content;
}



function screenContent(name: String, isAlreadyInit: boolean) {
  const widget = pascalize(name);
  const content = `
import 'package:flutter/material.dart';
import 'package:get/get.dart';

class ${widget}Screen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return GetBuilder<${widget}Controller>(
      builder: (${widget}ontroller) {
        return Scaffold();
      },
    );
  }
}`;

  const contentWithInit = `
import 'package:flutter/material.dart';
import 'package:get/get.dart';

class ${widget}Screen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return GetBuilder<${widget}Controller>(
      init: ${widget}Controller(),
      builder: (${widget}ontroller) {
        return Scaffold();
      },
    );
  }
}`;

  return isAlreadyInit ? content : contentWithInit;
}

