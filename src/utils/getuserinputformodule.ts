import * as vscode from 'vscode';
import { UserInputModel } from '../data/model/userinputmodel';


interface BooleanQuickPickItem extends vscode.QuickPickItem { value: boolean }

export async function getUserInput(inUri: vscode.Uri | undefined): Promise<UserInputModel> {
    const nameOpts: vscode.InputBoxOptions = {
        prompt: "New Module Name (LOWERCASE)",
        validateInput: async (value) => {
            return /^[0-9a-z ]+$/g.test(value) ? null : "It is not a valid module name !";
        }

    };
    const name = await vscode.window.showInputBox(nameOpts);
    if (name === undefined) {
        throw Error("Aborted");
    }

    const isInit: readonly BooleanQuickPickItem[] = await new Promise((res) => {
        const quickpick = vscode.window.createQuickPick<BooleanQuickPickItem>();
        const items = [{ label: "Yes", value: true }, { label: "No", value: false }];
        quickpick.title = "Is Controller/Provider has been initialized before?";
        quickpick.items = items;
        quickpick.onDidAccept(() => quickpick.hide());
        quickpick.onDidHide(() => { res(quickpick.selectedItems); quickpick.dispose(); });
        quickpick.show();
    });

    if (isInit === undefined || isInit.length === 0) {
        throw Error("Aborted");
    }
    const openOpts: vscode.OpenDialogOptions = { canSelectMany: false, canSelectFiles: false, canSelectFolders: true };

    var uri: vscode.Uri;

    if (inUri === undefined) {
        const userUri = await vscode.window.showOpenDialog(openOpts);
        if (userUri === undefined) {
            throw Error("Aborted");
        }
        uri = userUri[0];
    } else {
        uri = inUri;
    }
    const data: UserInputModel = {
        name: name,
        isAlreadyInit:isInit[0].value,
        uri: uri
    };


    return data;
}