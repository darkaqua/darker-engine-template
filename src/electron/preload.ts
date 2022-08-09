import { ipcRenderer } from 'electron';
import * as fs from "fs";
import * as path from "path";
import * as os from 'os';
import sharp from 'sharp';

(() => {
    console.log('### Preload ###');

    const _window = (window as any);

    _window.isElectron = true;
    _window.ipcRenderer = ipcRenderer;
    _window.fs = fs;
    _window.path = path;
    _window.os = os;
    _window.sharp = sharp;
})();