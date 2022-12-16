import io from "socket.io-client";

export let socket;

export const connect = () => {
    if (!socket) {
        console.log("we are connecting!");
        socket = io.connect();
    }
    return socket;
};
