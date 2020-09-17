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
var commands;

export const getClientStatus = () => {
    return clientStatus || CLIENT_STATUS_OFF;
};

export const setClientStatus = (status) => {
    if (status !== clientStatus) {
        clientStatus = status;
        emitter.emit(STATUS_CHANGE, {
            type: EVENT_TYPE_CLIENT_STATUS_CHANGE,
            status
        });
    }
};

export const clearCommands = () => {
    commands = [];
};

export const addCommand = (cmd, param, clientTo) => {
    let uid = uuid();
    commands = {
        cmd,
        param,
        uuid: uid,
        clientTo
    };
    return uid;
};

export const getCommand = () => {
    return commands ? commands : null;
};

export const popCommand = () => {
    commands = null;
};