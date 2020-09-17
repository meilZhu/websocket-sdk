/*
 * @file: 指令
 * @Date: 2020-09-07 17:54:06
 * @author: manyao.zhu
 */

import emitter from '../core/dispatch';
import { addCommand, getClientStatus, getCommand } from '../status/status';
import { CLIENT_STATUS_OFF, CLIENT_STATUS_ON } from '../constant/clientStatus';
import { EVENT_TYPE_LOG, EVENT_TYPE_RESULT, STATUS_CHANGE } from '../constant/event';
import { getWebSocket } from './socket';

let websocket = null;

/**
 * 等待Client启动后发送Command
 */
export const sendCommands = () => {
    let cmdObj = getCommand();
    if (cmdObj != null) {
        let params = {};
        params.cmd = cmdObj.cmd;

        if (cmdObj.param != null) {
            params.bizData = JSON.stringify(cmdObj.param);
        }

        if (cmdObj.clientTo != null) {
            params.clientTo = JSON.stringify(cmdObj.clientTo);
        }
        websocket = getWebSocket();
        websocket.socket.send(JSON.stringify(params));
    }
};

/**
 * 发送指令
 * @param cmd 指令
 * @param param 参数
 * @param clientTo 浏览器
 */
export const sendCommand = (cmd, param, clientTo) => {
    var cmdId = null;
    emitter.emit(STATUS_CHANGE, {
        type: EVENT_TYPE_LOG,
        status: 'EXECUTE_COMMAND',
        message: cmd
    });
    let stat = getClientStatus();
    if (stat !== CLIENT_STATUS_OFF) {
        cmdId = addCommand(cmd, param, clientTo);
    }
    if (stat === CLIENT_STATUS_ON) {
        sendCommands();
    } else if (stat === CLIENT_STATUS_OFF) {
        emitter.emit(STATUS_CHANGE, {
            type: EVENT_TYPE_RESULT,
            status: 'ERROR',
            message: '客户端未启动，请先初始化'
        });
    } else {
        emitter.emit(STATUS_CHANGE, {
            type: EVENT_TYPE_LOG,
            status: 'CLIENT_STARTING',
            message: '客户端正在启动，等待客户端启动...'
        });
    }
    return cmdId;
};