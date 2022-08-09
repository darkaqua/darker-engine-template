
export type CursorType = {
    onMove: (callback: (event: MouseEvent) => any) => number;
    onLeftClick: (callback: (event: MouseEvent) => any) => number;
    onRightClick: (callback: (event: MouseEvent) => any) => number;
    onScroll: (callback: (event: WheelEvent) => any) => number;
    // onChangeIsometricPosition: (callback: (event: Position3d) => any) => number;

    clearMove: (id: number) => void;
    clearLeftClick: (id: number) => void;
    clearRightClick: (id: number) => void;
    clearScroll: (id: number) => void;
    // clearChangeIsometricPosition: (id: number) => void;
}

export const Cursor = (): CursorType => {

    let _onCursorMoveSubscriberList: any[] = [];
    let _onLeftClickSubscriberList: any[] = [];
    let _onRightClickSubscriberList: any[] = [];
    let _onScrollSubscriberList: any[] = [];
    
    const _onMouseMove = (event: MouseEvent) => _onCursorMoveSubscriberList.filter(e => e !== undefined).forEach(func => func(event));
    const _onClick = (event: MouseEvent) => _onLeftClickSubscriberList.filter(e => e !== undefined).forEach(func => func(event));
    const _onContextMenu = (event: MouseEvent) => {
        event.preventDefault();
        _onRightClickSubscriberList.filter(e => e !== undefined).forEach(func => func(event));
    }
    const _onScroll = (event: MouseEvent) => _onScrollSubscriberList.filter(e => e !== undefined).forEach(func => func(event));
    
    
    window.addEventListener('click', _onClick, false);
    window.addEventListener('contextmenu', _onContextMenu, false);
    window.addEventListener('mousemove', _onMouseMove, false);
    window.addEventListener('mousewheel', _onScroll, false);
    

    const onMove = (callback: (event: MouseEvent) => any) =>
        _onCursorMoveSubscriberList.push(callback) - 1;
    const onLeftClick = (callback: (event: MouseEvent) => any) =>
        _onLeftClickSubscriberList.push(callback) - 1;
    const onRightClick = (callback: (event: MouseEvent) => any) =>
        _onRightClickSubscriberList.push(callback) - 1;
    const onScroll = (callback: (event: WheelEvent) => any) =>
        _onScrollSubscriberList.push(callback) - 1;
    // const onChangeIsometricPosition = (callback: (event: Position3d) => any) =>
    //     _onCursorIsometricPositionChangeSubscriberList.push(callback) - 1;

    const clearMove = (id: number) => _onCursorMoveSubscriberList[id] = undefined;
    const clearLeftClick = (id: number) => _onLeftClickSubscriberList[id] = undefined;
    const clearRightClick = (id: number) => _onLeftClickSubscriberList[id] = undefined;
    const clearScroll = (id: number) => _onScrollSubscriberList[id] = undefined;
    // const clearChangeIsometricPosition = (id: number) => _onCursorIsometricPositionChangeSubscriberList[id] = undefined;

    return {
        onMove,
        
        onLeftClick,
        onRightClick,
        onScroll,
        // onChangeIsometricPosition,

        clearMove,
        clearLeftClick,
        clearRightClick,
        clearScroll
        // clearChangeIsometricPosition,
    }
};