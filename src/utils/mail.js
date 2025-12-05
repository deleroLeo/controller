const { ImapFlow } = require ('imapflow');
const nodemailer = require("nodemailer");
const fs = require("fs");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: "",
    pass: "",
  },
});

const client = new ImapFlow({
    host: 'imap.gmail.com',
    port: 993,
    secure: true,
    auth: {
        user: '',
        pass: ''
    }
});

const del_inbox = async () => {
    await client.connect();

    let lock = await client.getMailboxLock('"[Gmail]/Alle Nachrichten"');
    try {        
        await client.messageDelete();


    } finally {
        lock.release();
    }


    await client.logout();
}

const del_trash = async () => {
    await client.connect();

    let lock = await client.getMailboxLock('"[Gmail]/Papierkorb"');
    try {        
        await client.messageFlagsAdd('1:* ', ['\\Deleted']);
        await client.messageDelete();
    } finally {
        lock.release();
    }


    await client.logout();
}

const send_mail = async () => {
    const info = await transporter.sendMail({
        from: '"Ein Supporter" <blr43x@gmail.com>',
        to: "cmx72x@gmail.com",
        subject: "Abgefangene Nachricht",
        text: "Hello world",
        attachments: [
        {
            filename: "morsecode.wav",
            path: "/absolutepath to it"
        },
        {
            filename: "photo.jpg",
            content: "/9j/4AAQSkZJRgABAQAAAQABAAD…", // truncated
            encoding: "base64",
        }
        ]
    })
}


