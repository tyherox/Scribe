import { app, BrowserWindow } from 'electron';

export var trestleMenuTemplate = {
    label: 'Trestle',
    submenu: [
        { label: 'Quit', accelerator: 'CmdOrCtrl+Q', click: () => app.quit()}
    ]
};
