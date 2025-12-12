import React from 'react'


const MailControl = ({sendMail, delMail}) =>{
    return(
        <div>
            <button onClick = {()=>sendMail("send-morse", (0))}>Send Mail</button>
            <button onClick = {delMail}>Delete Mails</button>
        </div>
    )
}

export default MailControl