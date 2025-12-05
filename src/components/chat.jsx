"use client"
import React from 'react'
import {useEffect, useState} from 'react'
import  ChatLog from "./chatlog.jsx"


const ChatBox = ({chatLog, sendMessage}) => {
    const [message, setMessage] = useState("");
  //console.log(displayHints)
    return (
        <div className="chat-section">
            
                <div id="chat-window">
                    <ChatLog chatLog={chatLog}/>
                </div>
                <div id="chat-form-container">
                    <div id="chat-form">
                        <input className = "chat-input" id="msg" type="text" placeholder="Chatnachricht..." required autoComplete="off" onChange={(e)=>setMessage(e.target.value)}/>
                        <button className ="btn small" onClick = {()=>sendMessage(message)}><i className="fas fa-paper-plane"></i></button>
                    </div>	
                </div>
                
            
        </div>
    )
}

export default ChatBox