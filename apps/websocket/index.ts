import WebSocket, { WebSocketServer } from "ws";
import { UserManager } from './UserManager';


const wss = new WebSocketServer({ port: 3001});



wss.on('connection', (socket: WebSocket) => {
    socket.on('error',console.error);
    console.log('Websocket server is connected now');
    
    UserManager.getInstance().addUser(socket);
});