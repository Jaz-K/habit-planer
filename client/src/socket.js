import io from "socket.io-client";

export let socket;

export const connect = () => {
    if (!socket) {
        socket = io.connect();
    }
    return socket;
};
