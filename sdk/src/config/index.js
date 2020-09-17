/*
 * @file: sdk的配置信息
 * @Date: 2020-09-07 15:39:28
 * @author: manyao.zhu
 */
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