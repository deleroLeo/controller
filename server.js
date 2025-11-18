import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";

//const fs = require('fs');

const formatMessage = require('utils/messages');
const {userJoin, getCurrentUser, UserLeave, getRoomUsers} = require ('utils/users');


//Mal gucken ob das relevant ist, oder unnötiger schnickschnack
/*const app = express();
const server = http.createServer(app);
const io = socketio(server, {pingTimeout: 600000})*/

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 2142;

const app = next({dev, hostname, port})
const handler = app.getRequestHandler();







app.prepare().then(() => {
    const httpServer = createServer(handler);

    const io = new Server(httpServer);

    io.on("connection", (socket) => {
        socket.on('joinRoom', ({username, room}) => {
            const user = userJoin(socket.id, username, room)
            socket.join(user.room)
            if(user.username ==="Controller") {
                // Notifiy the controller via a server-log when a user connects to the room.
                socket.broadcast.to(user.room).emit('server-log', formatMessage(botName, `${user.username} hat den Raum betreten.`));

                // Share the current room's status with the new user.
                io.to(user.room).emit('status', getCurrentStatus(user.room));
            }
        });

        socket.on('update-status', (newStatus)=> {
            //...
        });

        socket.on('send-morse', (room) => {
            //...
        });

        socket.on('send-cam', (room) => {
            //...
        });

        socket.on('mail-reset', (room)=>{
            //....
        });

        socket.on('settings-save', ({room, settings}) => {
            //...
        });

        socket.on('settings-load', (room) => {
            //...
        });
        //Spieler an Spielleiter*in, oder umgekehrt
        socket.on('chatMessage', msg => {
            //...
        });
        //Polizeichat-chatlog
        socket.on('chatLog', msg => {
            //....
        });

        socket.on('disconnect', (reason)=> {

        });

    });

    httpServer
        .once("error", (err) =>{
            console.error(err);
            process.exit(1);
        })
        .listen(port, () => {
            console.log(`> ready on http:$//${hostname}:${port}`)
        });
});