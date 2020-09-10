/*
 * @file: sdk的配置信息
 * @Date: 2020-09-07 15:39:28
 * @author: manyao.zhu
 */
// TOWEBSOCKET
let activePort;
let initConfig;

export const getInitConfig = (key) => {
    return initConfig == null ? null : initConfig[key];
};

export const setInitConfig = (config) => {
    initConfig = config;
};

export const basicURL = (port) => {
    return `ws://127.0.0.1:${port}/ws/`;
};

export const setActiveChannel = (port) => {
    activePort = port;
};


export const gethealthUrl = (port) => {
    return `${basicURL(port)}/health?t=${Date.now()}`;
};

export const getExecuteCommandUrl = () => {
    return `${basicURL(activePort)}/exec?t=${Date.now()}`;
};

export const getPushUrl = () => {
    return `${basicURL(activePort)}/push?t=${Date.now()}`;
};

export const taskListUrl = () => {
    if (!activePort || typeof activePort !== 'number') {
        return null;
    }
    return `${basicURL(activePort)}/list_task`;
};

export const closeUrl = () => {
    if (!activePort || typeof activePort !== 'number') {
        return null;
    }
    return `${basicURL(activePort)}/exit?t=${Date.now()}`;
};