"use client"
import React from 'react'
import {useEffect, useState} from 'react'


const ChatLog = ({chatLog}) => {
    const [message, setMessage] = useState("");
  //console.log(displayHints)
    useEffect(() =>{
        //console.log(chatLog)
    }, [chatLog])
    

    return (
        
        <div id="chat-log">
            {chatLog.map(({time, username, text}) => 
                <div className ={"message "+ username+"-message"}><p className = "meta"><span>{time} </span><span>{username}:</span> <span>{text}</span></p></div>
            )}
        </div>
                
                
                
    )
}

export default ChatLog