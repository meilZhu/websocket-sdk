/*
 * @file: 指令
 * @Date: 2020-09-07 17:54:06
 * @author: manyao.zhu
 */

import emitter from '../core/dispatch';
import { addCommand, getClientStatus, getCommand, popCommand } from '../status/status';
import { CLIENT_STATUS_OFF, CLIENT_STATUS_ON } from '../constant/clientStatus';
import { EVENT_TYPE_LOG, EVENT_TYPE_RESULT, STATUS_CHANGE } from '../constant/event';
import { getWebSocket } from './socket';
// import { createTaskMessage } from '../interface/task';

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

        websocket = getWebSocket();

        websocket.socket.send(JSON.stringify(params));

        websocket.socket.onmessage = (res) => {
            emitter.emit(STATUS_CHANGE, {
                type: EVENT_TYPE_RESULT,
                status: 'SUCCESS',
                message: '发送成功',
                data: JSON.parse(res.data)
            });
            if (cmdObj.callback != null) {
                cmdObj.callback(res.data);
            }
            popCommand(cmdObj);
        };

        websocket.socket.onerror = (error) => {
            emitter.emit(STATUS_CHANGE, {
                type: EVENT_TYPE_RESULT,
                status: 'ERROR',
                message: error
            });
        };
    }
};

/**
 * 发送指令
 * @param cmd 指令
 * @param param 参数
 * @param callback 回调
 */
export const sendCommand = (cmd, param, callback) => {
    var cmdId = null;
    emitter.emit(STATUS_CHANGE, {
        type: EVENT_TYPE_LOG,
        status: 'EXECUTE_COMMAND',
        message: cmd
    });
    let stat = getClientStatus();
    if (stat !== CLIENT_STATUS_OFF) {
        cmdId = addCommand(cmd, param, callback);
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