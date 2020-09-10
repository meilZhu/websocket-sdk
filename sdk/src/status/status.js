/*
 * @file: 客户端状态
 * @Date: 2020-09-07 17:04:19
 * @author: manyao.zhu
 */

import { CLIENT_STATUS_OFF } from '../constant/clientStatus';
import emitter from '../core/dispatch';
import * as uuid from 'uuid';
import { EVENT_TYPE_CLIENT_STATUS_CHANGE, STATUS_CHANGE } from '../constant/event';

var clientStatus;
var commands = [];

export const getClientStatus = () => {
    return clientStatus || CLIENT_STATUS_OFF;
};

export const setClientStatus = (status) => {
    if (status !== clientStatus) {
        emitter.emit(STATUS_CHANGE, {
            type: EVENT_TYPE_CLIENT_STATUS_CHANGE,
            status
        });
    }
    clientStatus = status;
};

export const clearCommands = () => {
    commands = [];
};

export const addCommand = (cmd, param, callback) => {
    let uid = uuid();
    commands.push({
        cmd,
        param,
        uuid: uid,
        callback
    });
    return uid;
};

export const getCommand = () => {
    return commands.length > 0 ? commands[0] : null;
};

export const popCommand = (cmdObj) => {
    if (commands.length > 0 && cmdObj === commands[0]) {
        return commands.pop();
    }
    return null;
};