const { ImapFlow } = require ('imapflow');
const nodemailer = require("nodemailer");
const fs = require("fs");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: "blr43x@gmail.com",
    pass: "vkvicooiqsgfjkgb",
  },
});

const client = new ImapFlow({
    host: 'imap.gmail.com',
    port: 993,
    secure: true,
    auth: {
        user: 'cmx72x@gmail.com',
        pass: 'frbpukwpdxzutpcf'
    }
});



async function deleteAllInFolder(folder) {
    const client = new ImapFlow({
        host: "imap.gmail.com",
        port: 993,
        secure: true,
        auth: {
            user: "cmx72x@gmail.com",
            pass: "frbpukwpdxzutpcf"
        }
    });

    await client.connect();

    const lock = await client.getMailboxLock(folder);

    try {
        console.log("Deleting messages in:", folder);

        // Mark ALL messages as \Deleted
        await client.messageFlagsAdd("1:*", ["\\Deleted"]);
        if (folder == "[Gmail]/Alle Nachrichten") {
        await client.messageFlagsAdd("1:*", ["\\Trash"],{ useLabels: true})}

        // EXPUNGE (wirklich löschen!)
        await client.mailboxClose(true);

    } finally {
        lock.release();
    }

    await client.logout();
}


const del_inbox = async () => {
    await client.connect();
    getGmailFolders(client);
    let lock = await client.getMailboxLock('[Gmail]/Alle Nachrichten');
    try {        
        await client.messageDelete();


    } finally {
        lock.release();
    }

    let lock2 = await client.getMailboxLock('[Gmail]/Papierkorb');
    try {        
        await client.messageFlagsAdd('1:*', ['\\Deleted']);
        await client.messageDelete();
    } finally {
        lock2.release();
    }


    await client.logout();
}

const del_trash = async () => {
    await client.connect();

    let lock = await client.getMailboxLock('[Gmail]/Papierkorb');
    try {        
        await client.messageFlagsAdd('1:*', ['\\Deleted']);
        await client.messageDelete();
    } finally {
        lock.release();
    }


    await client.logout();
}

const sendMail = async ({from, to, subject, text, attachments}) => {
    console.log("started Mail Process")
    const info = await transporter.sendMail({
        from: from,
        to: to,
        subject: subject,
        text: text,
        attachments: attachments
    })
}
const delMails = () =>{
    deleteAllInFolder("INBOX");
    deleteAllInFolder("[Gmail]/Alle Nachrichten");
    deleteAllInFolder("[Gmail]/Papierkorb");
    sendMail({
        from: '"Meli Drechsler" <meli.drechsler@gmail.com>',
        to: "cmx72x@gmail.com",
        subject: "Wie gewünscht :)",
        text: "Hier wie besprochen nochmal die 09 \n LG \n Meli",
        attachments: [
        {
            filename: "09.zip",
            path: "./src/utils/09.zip"
        },
        /*{
            filename: "photo.jpg",
            content: "/9j/4AAQSkZJRgABAQAAAQABAAD…", // truncated
            encoding: "base64",
        }*/
        ]
    })

}



module.exports = {
    delMails,
    sendMail
};