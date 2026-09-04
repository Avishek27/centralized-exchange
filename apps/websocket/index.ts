import WebSocket, { WebSocketServer } from "ws";
import { UserManager } from './UserManager';

const PORT = Number(process.env.PORT || 3001);

const wss = new WebSocketServer({ port: PORT});



wss.on('connection', (socket: WebSocket) => {
    socket.on('error',console.error);
    console.log('Websocket server is connected now');
    
    UserManager.getInstance().addUser(socket);
});