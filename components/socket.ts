import { io } from "socket.io-client";

export const socket = io('localhost:3200', { transports: ['websocket'] });

socket.onAny((event, ...args) => {
    console.log(event, args);
  });  