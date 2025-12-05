import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";


//const fs = require('fs');

import  formatMessage  from "./src/utils/messages.js";
import {userJoin, getCurrentUser, userLeave, getRoomUsers} from "./src/utils/users.js";

import fs from 'fs';


//Mal gucken ob das relevant ist, oder unnötiger schnickschnack
/*const app = express();
const server = http.createServer(app);
const io = socketio(server, {pingTimeout: 600000})*/

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3000;

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
                
            }
            console.log("connected Room: ", user.room)
                // Share the current room's status with the new user.
            //io.in(user.room).emit('status', (user.room));
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

        socket.on('settings-save', (settings) => {
            console.log(settings);
            fs.writeFileSync("./settings/generalSettings.json", JSON.stringify(settings));
        });

        socket.on('cam-setting-save', (settings)=>{
            fs.writeFileSync("./settings/camSettings.json", JSON.stringify(settings, null, 2));
        });

        socket.on('preset-save', (settings) => {
            fs.writeFileSync("./settings/presets.json", JSON.stringify(settings, null, 2));
        });

        socket.on('settings-load', () => {
            //console.log("reading Settings");
            const settings = JSON.parse(fs.readFileSync("./settings/generalSettings.json"));
            //console.log(settings);
            const user = getCurrentUser(socket.id);
            //console.log(user.room)
            io.in(user.room).emit('settingLog', (settings));
            //io.to..emit('settingLog', (settings));
        });



        //Spieler an Spielleiter*in, oder umgekehrt
        socket.on('chatMessage', msg => {
            //...
        });

        socket.on('cams-load', () => {
            const settings = JSON.parse(fs.readFileSync("./settings/camSettings.json"));
            const user = getCurrentUser(socket.id);
            if (user) {
                io.to(user.room).emit('settingLog', formatMessage(user.username, settings));
            }
        });
        //Spieler an Spielleiter*in, oder umgekehrt
        socket.on('chatMessage', msg => {
            //...
        });

        socket.on('presets-load', () => {
            const settings = JSON.parse(fs.readFileSync("./settings/presets.json"));
            const user = getCurrentUser(socket.id);
            if (user) {
                io.to(user.room).emit('settingLog', settings);
            }
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