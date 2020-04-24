import socketIOClient from "socket.io-client";

export const socket = socketIOClient("http://192.168.1.201:1337")
