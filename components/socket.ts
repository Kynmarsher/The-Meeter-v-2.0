import { io } from "socket.io-client";

export const socket = io('217.28.222.133:3200', { transports: ['websocket'] });

socket.onAny((event, ...args) => {
    console.log(event, args);
  });  