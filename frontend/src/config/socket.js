import socket from 'socket.io-client';

let socketInstance = null;

export const initializeSocket = (projectId) =>{
    socketInstance = socket(import.meta.env.VITE_API_BASE_URL,{
        
        auth:{
            token: localStorage.getItem('token')
        },
        query:{
            projectId: projectId
        }
    });

    return socketInstance;
}

export const sendMessage = (eventName, data) => {
    console.log("Sending:", data);
    socketInstance.emit(eventName, data);
}

export const receiveMessage = (eventName, cb) => {
    socketInstance.on(eventName, (data) => {
        console.log("Received:", data);
        cb(data);
    });
}

export const disconnectSocket = () => {
  if (socketInstance) {
    socketInstance.disconnect();
    socketInstance = null;
  }
};