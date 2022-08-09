import {SystemFunction} from "darker-engine";
import {Component} from "../../component.const";
import {TextConfig, textDisplayObject, TextUIType} from "../../display-objects/text.display-object";
import {Canvas} from "../../../canvas/canvas";
import {displayObjectSystem} from "../_render/_displayObject.system";
import * as PIXI from 'pixi.js';
import {Color} from "../../../enums/colors.enum";
import {System} from "../../../system/system";
import {CAMERA_ENTITY} from "../../entities/camera.entity";
import {Configuration} from "../../../configuration/configuration";
import {ConfigurationItemEnum} from "../../../configuration/configuration.enum";
import {Position3d} from "../../types/generics.types";
import {CURSOR} from "../../entities/_experimental/cursor.entity";
import {CursorComponent} from "../../components/cursor.component";

export const uiSystem: SystemFunction = () => {

    let onUpdateId: number;
    let onResizeId: number[] = [];
    let keyboardOnKeyUpId: number;

    let canvasOnFPSChange: number;
    let positionCameraEntityUpdateComponentListenerId: number;
    let squareCameraEntityUpdateComponentListenerId: number;

    let cursorUpdateComponentListenerId: number;
    
    const list: any[] = [
        {
            canHide: false,
            position: 'left',
            onStart: (text: TextUIType) => {
                canvasOnFPSChange = Canvas.onFPSChange((fps) => {
                    text.setText(`${fps} FPS`);
                });
            }
        },
        {
            canHide: true,
            position: 'left',
            margin: 2,
            onStartAndUpdate: (text: TextUIType) => {
                text.setText(`CPU: ${Math.round(process.getCPUUsage().percentCPUUsage)}%`);
            }
        },
        {
            canHide: true,
            position: 'left',
            onStartAndUpdate: async (text: TextUIType) => {
                const mbTotal = Math.round((System.os.totalmem()) / 1024 / 1024);
                const mbFree =  Math.round((System.os.freemem())/ 1024 / 1024);
                const mbUsed =  Math.round(process.memoryUsage().heapTotal / 1024 / 1024);
                mbUsed;
    
                text.setText(`Memory: ${mbUsed}MB/${(mbTotal - mbFree)}MB`, textConfig);
            }
        },
        {
            canHide: true,
            position: 'left',
            margin: 2,
            onStart: async (text: TextUIType) => {
                onResizeId[0] = Canvas.onResize(() => {
                    const {width, height} = Canvas.getBounds();
                    const scale = Canvas.getScale();
                    text.setText(`Size: ${width * scale}x${height * scale}`, textConfig);
                });
            
            }
        },
        {
            canHide: true,
            position: 'left',
            onStart: async (text: TextUIType) => {
                const scale = Canvas.getScale();
                text.setText(`Scale: ${scale}`, textConfig);
            }
        },
        {
            canHide: true,
            position: 'left',
            margin: 2,
            onStart: (text: TextUIType) => {
                text.setText('Cursor: -.-.-');
                let lastCurrentIsometricPosition: Position3d = { x: 0, y: 0, z: 0 };

                const _render = () => {
                    
                    const getPosText = (pos: Position3d) => {
                        if(!pos) return `-.-.-`;
                        const { x, y, z } = pos;
                        return `${x}.${y}.${z}`;
                    }
                    
                    text.setText(`Cursor: ${getPosText(lastCurrentIsometricPosition)}`);
                }


                cursorUpdateComponentListenerId = CURSOR.addUpdateComponentListener((component, data ) => {
                    const {
                        currentIsometricPosition
                    } = data as any as CursorComponent;

                    lastCurrentIsometricPosition = currentIsometricPosition ? currentIsometricPosition : lastCurrentIsometricPosition;
                    
                    _render();
                })
            }
        },
        //---
        {
            canHide: false,
            position: 'right',
            onStart: (text: TextUIType) => {
                text.setConfig({ backgroundOpacity: 0 });
            }
        },
        {
            canHide: false,
            position: 'right',
            onStart: (text: TextUIType) => {
                text.setConfig({ backgroundOpacity: 0 });
            }
        },
        {
            canHide: true,
            position: 'right',
            margin: 2,
            onStart: (text: TextUIType) => {
                let platformName = System.os.platform().trim();
                switch (platformName) {
                    case 'win32':
                        platformName = 'Windows';
                        break;
                    case 'darwin':
                        platformName = 'MacOS';
                }
                text.setText(`${platformName} (${System.os.release()})`)
            }
        },
        {
            canHide: true,
            position: 'right',
            margin: 2,
            onStart: (text: TextUIType) => {
                const cpus = System.os.cpus();
                text.setText(`${cpus.length}x ${cpus[0].model?.trim()}`)
            }
        },
        {
            canHide: true,
            position: 'right',
            onStart: (text: TextUIType) => {
                const gpuInfo = System.getGPUInfo();
                const { glRenderer } = gpuInfo.auxAttributes;
                if(!glRenderer)
                    return text.setText(`-`);
                // https://github.com/pmndrs/detect-gpu/blob/7186ff9220e516526bde46d3f86d10efcaa1d05b/src/internal/cleanRenderer.ts#L3
                let gpuName = glRenderer
                    // Strip off ANGLE() - for example:
                    // 'ANGLE (NVIDIA TITAN Xp)' becomes 'NVIDIA TITAN Xp'':
                    .replace(/^ANGLE ?\((.+)\)*$/, '$1')
                    // Strip off [number]gb & strip off direct3d and after - for example:
                    // 'Radeon (TM) RX 470 Series Direct3D11 vs_5_0 ps_5_0' becomes
                    // 'Radeon (TM) RX 470 Series'
                    .replace(/\s(\d{1,2}gb|Direct3D.+$)|\(r\)| \([^)]+\)$/g, '');
                gpuName = (gpuName.includes(',') ? gpuName.split(',')[1] : gpuName).trim();
                text.setText(`${gpuName}`);
            }
        },
        {
            canHide: true,
            position: 'right',
            onStart: (text: TextUIType) => {
                const mbTotal = Math.round((System.os.totalmem()) / 1024 / 1024 / 1024);
                text.setText(`RAM ${mbTotal}GB`);
            }
        },
        {
            canHide: true,
            position: 'right',
            onStart: (text: TextUIType) => {
                const primaryDisplay = System.getPrimaryDisplay();
                text.setText(`${primaryDisplay.bounds.width}x${primaryDisplay.bounds.height} @ ${primaryDisplay.displayFrequency}Hz`);
            }
        }
    ]
    
    const textConfig: TextConfig = {
        backgroundColor: Color.BLACK,
        backgroundOpacity: .75,
        padding: [6, 3, 6, 3]
    };

    const { getDisplayObject } = displayObjectSystem();

    let _textDisplayObjectList: TextUIType[] = [];
    
    const onAdd = (id: string) => {
        const container = getDisplayObject(id) as PIXI.Container;
        container.zIndex = Number.MAX_SAFE_INTEGER + 1;
        
        const _list = list.map((option) => {
            const _text = textDisplayObject(` `, textConfig);
            option.onStart && option.onStart(_text);
            option.onStartAndUpdate && option.onStartAndUpdate(_text);
            _textDisplayObjectList.push(_text);
            return {
                ...option,
                _text
            };
        });
        
        _list.forEach((option) => {
            container.addChild(option._text.getContainer());
        });
    
        onUpdateId = Canvas.onUpdate(60, () => {
            _list.forEach((option) => {
                option?.onStartAndUpdate && option?.onStartAndUpdate(option._text);
            });
        });
    
        onResizeId[1] = Canvas.onResize(() => {
            const { width, height } = Canvas.getBounds();
        
            let lastLeftPositionY: number = - (height / 2);
            let lastRightPositionY: number = - (height / 2);
        
            _list.forEach((option) => {
                const _container = option._text.getContainer();
            
                switch (option.position) {
                    case 'left':
                        _container.position.set(
                            - (width / 2),
                            lastLeftPositionY + (option.margin || 0)
                        )
                        lastLeftPositionY = _container.position.y + _container.height;
                        break;
                    case 'right':
                        _container.position.set(
                            (width / 2) - _container.width,
                            lastRightPositionY + (option.margin || 0)
                        )
                        lastRightPositionY = _container.position.y + _container.height;
                        break;
                }
            });
        
        });

        let isVisible = Boolean(Configuration.getItem(ConfigurationItemEnum.SHOW_GAME_INFO));
        
        const _reload = () => {
            Configuration.setItem(ConfigurationItemEnum.SHOW_GAME_INFO, isVisible);
            _list.filter(option => option.canHide).forEach((option) => {
                option._text.setConfig({ visible: isVisible });
            })
        }
    
        keyboardOnKeyUpId = System.io.keyboard.onKeyUp(({ key }) => {
            if(key !== 'F12') return;
    
            isVisible = !isVisible;
            _reload();
        });
        _reload();
    }
    
    const onRemove = (id: string) => {
        Canvas.clearUpdate(60, onUpdateId);

        onResizeId.forEach(Canvas.clearResize)
        System.io.keyboard.clearKeyUp(keyboardOnKeyUpId);
    
        Canvas.clearFPSChange(canvasOnFPSChange);
        CAMERA_ENTITY.removeUpdateComponentListener(positionCameraEntityUpdateComponentListenerId);
        CAMERA_ENTITY.removeUpdateComponentListener(squareCameraEntityUpdateComponentListenerId);
        CURSOR.removeUpdateComponentListener(cursorUpdateComponentListenerId);
    
        _textDisplayObjectList.forEach(_text => _text.destroy());
        _textDisplayObjectList = [];
    }

    return {
        components: [
            Component.DISPLAY_OBJECT,
            Component.SPRITE,
            Component.ISOMETRIC_POSITION,
            Component.UI,
        ],
        onAdd,
        onRemove
    }
};
