import { io } from "socket.io-client";

export const socket = io('http://api.themeeter.ru', { transports: ['websocket'] });

socket.onAny((event, ...args) => {
    console.log(event, args);
  });  