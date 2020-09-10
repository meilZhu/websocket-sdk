/*
 * @file:
 * @Date: 2020-09-08 16:24:06
 * @author: manyao.zhu
 */
let websocket = null;

export function setWebSocket(socket) {
    websocket = socket || null;
}

export function getWebSocket() {
    return websocket;
}