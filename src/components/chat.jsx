"use client"
import React from 'react'
import {useEffect, useState, useRef, useContext} from 'react'
import  ChatLog from "./chatlog.jsx"
import { HeightContext } from "./Contexts/heightContext";


const ChatBox = ({chatLog, sendMessage, resize}) => {

    const parentHeight = useContext(HeightContext);
    const [style, setStyle] = useState({});

    const [message, setMessage] = useState("");
    const [maxHeight, setMaxHeight]= useState(0);
    const itemRef = useRef();
    
    useEffect(()=>{
        setMaxHeight(parentHeight)
        console.log("ParentHeight:", parentHeight)
        console.log("maxHeightprevRender",maxHeight)

        setStyle({
        overflowY: "scroll",
        overflowX: "hidden",
        minHeight:"0",
        height:"100%",
        flex:"1",
        paddingTop: "1%",
        maxHeight: parentHeight-30
    })

    },[resize])
    return (
        <div ref ={itemRef} className="chat-container">
                <div style = {style} >
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