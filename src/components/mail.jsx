import React from 'react'


const MailControl = ({sendMail, delMail}) =>{
    return(
        <div>
            <button onClick = {sendMail}>Send Mail</button>
            <button onClick = {delMail}>Delete Mails</button>
        </div>
    )
}

export default MailControl