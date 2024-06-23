import { io } from "socket.io-client";

export const socket = io('http://localhost:3200', { transports: ['websocket'] });

socket.onAny((event, ...args) => {
    console.log(event, args);
  });  