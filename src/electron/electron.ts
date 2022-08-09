import {app, BrowserWindow, globalShortcut, dialog, MessageBoxSyncOptions, ipcMain, Menu, MenuItem, screen} from "electron";
import path from "path";

declare const NAME: string;

export const Electron = (() => {

    const isDevelopment = process.env.NODE_ENV === 'development';

    const load = async () => {
        await app.whenReady();
        app.setName(NAME);
        app.setPath('userData', path.join(app.getPath('appData'), `.${NAME}`))

        const window = new BrowserWindow({
            title: NAME,
            width: 1000,
            height: 600,
            backgroundColor: '#1e1e1e',
            webPreferences: {
                nodeIntegration: true,
                devTools: isDevelopment,
                contextIsolation: false,
                preload: path.join(__dirname, 'preload.js'),
                allowRunningInsecureContent: true
            },
            // alwaysOnTop: true,
            roundedCorners: true,
            alwaysOnTop: true,
            icon: path.join(__dirname, require('./icon_x256.png').default)
        });
        globalShortcut.register('Control+Shift+I', () => {
            // When the user presses Ctrl + Shift + I, this function will get called
            // You can modify this function to do other things, but if you just want
            // to disable the shortcut, you can just return false
            return false;
        });

        ipcMain.on('config', async (event) => {
            event.sender.send('config', {
                userDataPath: app.getPath('userData'),
                gpuInfo: await app.getGPUInfo('complete'),
                primaryDisplay: screen.getPrimaryDisplay()
            })
        });
    
        app.getVersion()
        
        if(isDevelopment) {
            await window.loadURL(`http://localhost:8080#development`);
            window.webContents.openDevTools()
        } else {

            if (process.platform === 'darwin') {
                const template: MenuItem[] = [
                    new MenuItem({
                        label: NAME,
                        submenu: [
                            {
                                role: 'quit'
                            }
                        ]
                    })
                ];

                Menu.setApplicationMenu(Menu.buildFromTemplate(template));
            } else {
                Menu.setApplicationMenu(null)
            }

            await window.loadFile(path.join(__dirname, 'index.html'));
        }
        window.setAlwaysOnTop(false);

        globalShortcut.register("CmdOrCtrl+F12", () => {
            if(!window.isFocused()) return;

            window.setFullScreen(!window.isFullScreen())
        });

        process.on("uncaughtException", (errorMessage) => {
            console.log(errorMessage)
            const messageBoxOptions: MessageBoxSyncOptions = {
                type: "error",
                title: "Error",
                message: errorMessage.message
            };
            dialog.showMessageBoxSync(messageBoxOptions);

            // I believe it used to be the case that doing a "throw err;" here would
            // terminate the process, but now it appears that you have to use's Electron's
            // app module to exit (process.exit(1) seems to not terminate the process)
            app.exit(1);
        });

        // SQLite.load();
    
        // Storage.load();
    }

    return {
        load
    }
})();