/*
 * @file: sdk的配置信息
 * @Date: 2020-09-07 15:39:28
 * @author: manyao.zhu
 */
import { CONFIG_KEY_WEBSOCKET_URL } from '../constant/configStatus';
let initConfig;

export const getInitConfig = (key) => {
    return initConfig == null ? null : initConfig[key];
};

export const setInitConfig = (config) => {
    initConfig = config;
};

export const basicURL = (port) => {
    if (!getInitConfig(CONFIG_KEY_WEBSOCKET_URL)) {
        return `ws://127.0.0.1:${port}/ws/`;
    }
    return getInitConfig(CONFIG_KEY_WEBSOCKET_URL);
};