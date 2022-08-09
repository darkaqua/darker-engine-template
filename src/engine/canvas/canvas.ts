import * as PIXI from "pixi.js";
import {Color} from "../enums/colors.enum";
import {Configuration} from "../configuration/configuration";
import {ConfigurationItemEnum} from "../configuration/configuration.enum";
import {IDestroyOptions} from "@pixi/display";

export const Canvas = (() => {
    let app: PIXI.Application;

    let scale: number = parseInt(Configuration.getItem(ConfigurationItemEnum.SCALE) || '3');

    let isFocused: boolean = false;
    // let isFocusedDateTime: number = Date.now();

    let _onLoadSubscriberList: any[] = [];
    let _onResizeSubscriberList: any[] = [];
    let _onFocusSubscriberList: any[] = [];

    let _onFPSChangeSubscriberList: any[] = [];
    let _lastFPS: number = 0;
    let _maxFPS: number = 0;

    let isLoaded: boolean = false;
    
    const _deltaObjectList: { delta: number, list: any[], divide: number }[] = [];

    const displayObjectMap: Map<string, PIXI.DisplayObject> = new Map<string, PIXI.DisplayObject>();

    const _onResize = () => {
        const { devicePixelRatio } = window;
        const { width, height } = getBounds();

        app.renderer.resolution = scale * Math.round(devicePixelRatio);
        // Stage resolution adjustment
        app.renderer.plugins.interaction.resolution = app.renderer.resolution;
        app.renderer.resize(width, height);

        app.view.style.width = `${Math.round(width * scale)}px`;
        app.view.style.height = `${Math.round(height * scale)}px`;

        app.stage.position.set(Math.round(width / 2), Math.round(height / 2));

        _onResizeSubscriberList.filter(sub => sub !== undefined).forEach(func => func());
    }

    const _onZoom = () => {
        console.log(window.devicePixelRatio)
    }

    /**
     * @private
     * @param delta
     */
    const _onUpdate = (delta: number) => {

        _deltaObjectList.forEach((_delta) => {
            _delta.delta += delta / _delta.divide;
            let truncateDelta = Math.trunc(_delta.delta);
            if(truncateDelta > 0) {
                _delta.delta -= truncateDelta;
                _delta.list.forEach(sub => sub && sub(truncateDelta));
            }
        });

        const fps = getFps();
        if(fps !== _lastFPS) {
            _lastFPS = fps;
            _onFPSChangeSubscriberList.forEach(sub => sub && sub(fps));

            if(_lastFPS > _maxFPS)
                _maxFPS = _lastFPS;
        }

    }

    /**
     * @private
     * Fixes out of focus from the screen
     */
    const _onVisibilityChange = () => {
        isFocused = !document.hidden;

        _onFocusSubscriberList.forEach(func => func && func(isFocused));

        // if(!isFocused) return isFocusedDateTime = Date.now();
        //
        // const elapsedTime = (Date.now() - isFocusedDateTime) / app.ticker.deltaMS;
        //
        // if(!isNaN(elapsedTime)) return _onUpdate(elapsedTime);
    }

    const load = () => {
        if(app) return;

        const { width, height } = getBounds();

        app = new PIXI.Application({
            width,
            height,
            backgroundColor: Color.GRAY_500,
            antialias: true,
            autoDensity: true,
        });
        app.stage.sortableChildren = true;
        app.stage.interactive = true;
        // Renders crisp pixel sprites
        PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;
        PIXI.settings.FAIL_IF_MAJOR_PERFORMANCE_CAVEAT = true;

        document.getElementById('root').appendChild(app.view);

        // Not executing anymore on time because texture loading is slow.
        // window.addEventListener('load', _onResize);
        window.addEventListener('resize', _onResize);
        window.addEventListener('zoom', _onZoom);

        window.document.addEventListener('visibilitychange', _onVisibilityChange, false);

        app.ticker.add(_onUpdate);

        isLoaded = true;
        _onLoadSubscriberList.filter(sub => sub !== undefined).forEach(sub => sub());

        _onResize();
    }
    const reload = () => {
        _onResize();
    }

    const getApp = () => app;

    const onLoad = (callback: () => any) => isLoaded ? callback() : _onLoadSubscriberList.push(callback) - 1;
    const onResize = (callback: () => any) => _onResizeSubscriberList.push(callback) - 1;
    const onFocus = (callback: (focus: boolean) => any) => _onFocusSubscriberList.push(callback) - 1;
    const onFPSChange = (callback: (fps: number) => any) => _onFPSChangeSubscriberList.push(callback) - 1;
    const onUpdate = (divide: number, callback: (delta: number) => any) => {
        const deltaObject = _deltaObjectList.find(delta => delta.divide === divide);
        if(!deltaObject) {
            _deltaObjectList.push({
                divide,
                list: [callback],
                delta: 0
            });
            return 0;
        }
        return deltaObject.list.push(callback) - 1;
    }

    const clearLoad = (id: number) => _onLoadSubscriberList[id] = undefined;
    const clearResize = (id: number) => _onResizeSubscriberList[id] = undefined;
    const clearFocus = (id: number) => _onFocusSubscriberList[id] = undefined;
    const clearFPSChange = (id: number) => _onFPSChangeSubscriberList[id] = undefined;
    const clearUpdate = (divide: number, id: number) => _deltaObjectList.find(delta => delta.divide === divide).list[id] = undefined;

    const getFps = (): number => Math.round(app.ticker.FPS) || 1;
    const getMaxFps = (): number => _maxFPS;
    const getMaxTicks = (): number => Math.round(1000 / getMaxFps());
    const getTicks = (): number => Math.round(app.ticker.elapsedMS);

    const getDisplayObject = (id: string) => displayObjectMap.get(id);
    const removeDisplayObject = (id: string, options?: IDestroyOptions) => {
        displayObjectMap.delete(id);
        getDisplayObject(id)?.destroy(options);
    }
    const addDisplayObject = (displayObject: PIXI.DisplayObject) => displayObject.name && displayObjectMap.set(displayObject.name, displayObject);

    const getScale = () => parseInt(`${scale}`);
    const setScale = (_scale: number) => {
        scale = _scale;
        Configuration.setItem(ConfigurationItemEnum.SCALE, _scale)
        _onResize();
    }

    const getBounds = (): PIXI.ISize => {
        const { innerWidth, innerHeight } = window;
    
        const _getOddExtra = (value: number): number => (value % 2 === 1 ? 1 : 0) + value;
        return {
            width: _getOddExtra(Math.round(innerWidth / scale)),
            height: _getOddExtra(Math.round(innerHeight / scale))
        };
    }

    return {
        load,
        reload,

        getApp,

        onLoad,
        onResize,
        onFocus,
        onFPSChange,
        onUpdate,

        clearLoad,
        clearResize,
        clearFocus,
        clearFPSChange,
        clearUpdate,

        getFps,
        getMaxFps,
        getMaxTicks,
        getTicks,

        getDisplayObject,
        removeDisplayObject,
        addDisplayObject,

        getScale,
        setScale,

        getBounds
    }
})();
