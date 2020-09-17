/*
 * @file: 退出的服务操作
 * @Date: 2020-09-07 16:50:13
 * @author: manyao.zhu
 */

import emitter from '../core/dispatch';

import { setClientStatus, clearCommands } from '../status/status';
import { CLIENT_STATUS_OFF } from '../constant/clientStatus';

import { EVENT_TYPE_LOG, STATUS_CHANGE } from '../constant/event';
import { getWebSocket } from '../core/socket';

let websocket = getWebSocket();

//  停止检查
function stopFetch() {
    if (websocket) {
        websocket.close = () => {};
    }
}

/**
 * 停止通信
 */
export function disconnect() {
    emitter.emit(STATUS_CHANGE, {
        type: EVENT_TYPE_LOG,
        status: 'CLIENT_DISCONNECT',
        message: '客户端断开连接'
    });
    setClientStatus(CLIENT_STATUS_OFF);
    emitter.removeAllListeners();
    stopFetch();
}

/**
 * 退出
 * @param force 强制退出
 */
export function exit() {
    emitter.emit(STATUS_CHANGE, {
        type: EVENT_TYPE_LOG,
        status: 'CLIENT_ALREADY_CLOSE',
        message: '客户端正在关闭'
    });
    clearCommands();
    setClientStatus(CLIENT_STATUS_OFF);
    emitter.removeAllListeners();
    stopFetch();
}