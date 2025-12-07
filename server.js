import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";



//const fs = require('fs');

import  formatMessage  from "./src/utils/messages.js";
import  {delMails, sendMail}  from "./src/utils/mail.js";

import {userJoin, getCurrentUser, userLeave, getRoomUsers} from "./src/utils/users.js";

import fs from 'fs';


//Mal gucken ob das relevant ist, oder unnötiger schnickschnack
/*const app = express();
const server = http.createServer(app);
const io = socketio(server, {pingTimeout: 600000})*/

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 4000;

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

        socket.on("choose-room", (roomName) => {

        });

        socket.on('send-morse', (room) => {
            sendMail({
                from: '"Ein Supporter" <blr43x@gmail.com>',
                to: "cmx72x@gmail.com",
                subject: "Abgefangene Nachricht",
                text: "Konnte noch was aus ihrer privater Kommunikation Abfangen. Schaut mal! \n LG Meli",
                attachments: [
                {
                    filename: "morsecode.wav",
                    path: "./src/utils/10_morsecode.wav"
                },
                /*{
                    filename: "photo.jpg",
                    content: "/9j/4AAQSkZJRgABAQAAAQABAAD…", // truncated
                    encoding: "base64",
                }*/
                ]
        })
        });

        socket.on('send-cam', (room) => {
            //...
        });

        socket.on('mail-reset', (room)=>{
            delMails()
        });

        socket.on('settings-save', (settings) => {
            console.log(settings);
            fs.writeFileSync("./settings/generalSettings.json", JSON.stringify(settings));
        });

        socket.on('cam-save', (settings)=>{
            const cams = JSON.parse(fs.readFileSync("./settings/generalSettings.json"));
            let newCam = settings
            

            if (settings.type==="rtsp"){
                newCam.url = `http://192.168.6.2:8083/stream/${settings.room}/channel/${cams.length}/add`;
                const username = "admin";
                const password = "EXITmobil";

                fetch(`http://192.168.6.2:8083/stream/${settings.room}/channel/${cams.length}/add`, {
                method: "POST",
                credentials: "include",
                body: JSON.stringify({name: settings.name,
                        url: settings.url,
                        on_demand: true,
                        audio: true,
                        debug: false,
                        status: 0
                        }),
                headers: {
                    'Authorization': `Basic `+ Buffer.from(`${username}:${password}`).toString("base64"),
                    "Content-type": "application/json"  
                }
                })
                .then(async res => {
                    if (!res.ok) {
                        const errorText = await res.text();
                        throw new Error(`Fehler: ${res.status} ${res.statusText} - ${errorText}`);
                    }
                    return res.json();
                    })
                    .then(data => {
                    console.log('Antwort:', data);
                    })
                    .catch(err => {
                    console.error('Request fehlgeschlagen:', err.message);
                    });
                }

                cams.push(newCam);
                fs.writeFileSync("./settings/camSettings.json", JSON.stringify(cams, null, 2));
            }
        );
        

        socket.on('preset-save', (settings) => {
            fs.writeFileSync("./settings/presets.json", JSON.stringify(settings, null, 2));
        });

        socket.on('settings-load', () => {
            //console.log("reading Settings");
            const settings = JSON.parse(fs.readFileSync("./settings/generalSettings.json"));
            //console.log(settings);
            const user = getCurrentUser(socket.id);
            //console.log(user.room)
            io.in(user.room).emit('settingLog:settings-load', (settings));
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
                io.to(user.room).emit('settingLog:cams-load', settings);
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
                io.to(user.room).emit('settingLog:presets-load', settings);
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