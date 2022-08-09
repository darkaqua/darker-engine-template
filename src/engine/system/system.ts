import * as fsType from "fs";
import * as pathType from "path";
import * as osType from 'os';
import sharpType from 'sharp';
import { Display, IpcRenderer } from 'electron';
import {Io, IoType} from "./io/io";

declare const BUILD_ID: string;
declare const NAME: string;

export type SystemType = {
    load: () => Promise<any>;

    name: string;
    buildId: string;
    isDevelopment: boolean;

    isElectronActive: boolean;
    ipcRenderer: IpcRenderer;
    fs: typeof fsType;
    path: typeof pathType;
    os: typeof osType;

    io: IoType;
    
    sharp: typeof sharpType;

    getGamePath: () => string;
    getGPUInfo: () => any;
    getPrimaryDisplay: () => Display;
}

export const System = ((): SystemType => {
    
    const name: string = NAME;
    const buildId: string = BUILD_ID;
    const isDevelopment: boolean = window.location.hash === '#development';
    
    const currentWindow = (window as any);
    
    const isElectronActive: boolean = currentWindow.isElectron;
    const ipcRenderer: IpcRenderer = currentWindow.ipcRenderer;
    const fs: typeof fsType = currentWindow.fs;
    const path: typeof pathType = currentWindow.path;
    const os: typeof osType = currentWindow.os;
    const sharp: typeof sharpType = currentWindow.sharp;
    
    let _gamePath = '';
    let _gpuInfo = {};
    let _primaryDisplay = {};
    
    const getGamePath  = (): string => _gamePath;
    const getGPUInfo = (): any => _gpuInfo;
    const getPrimaryDisplay = (): Display => _primaryDisplay as Display;

    const io = Io();
    
    const load = (): Promise<any> => {
        if(!isDevelopment) console.log = () => '';

        return new Promise<any>((resolve) => {
            ipcRenderer.once('config', (_, data) => {
                const {
                    userDataPath,
                    gpuInfo,
                    primaryDisplay
                } = data;
        
                _gamePath = path.join(userDataPath, `/Game`);
                _gpuInfo = gpuInfo;
                _primaryDisplay = primaryDisplay;
    
                resolve(true);
            });
            ipcRenderer.send('config');
        })
    }
    
    
    return {
        load,
        
        name,
        buildId,
        isDevelopment,
        
        isElectronActive,
        ipcRenderer,
        fs,
        path,
        os,

        io,
        
        sharp,
    
        getGamePath,
        getGPUInfo,
        getPrimaryDisplay
    }
})();