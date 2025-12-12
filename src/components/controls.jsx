"use client"
import React, { act } from 'react'
import {useEffect, useState, useRef} from 'react'
import {createPortal} from 'react-dom'

const MailDelete = ({activeRoom, delMail}) =>{
    return(
        <div>
            <button onClick = {delMail}>Mails löschen</button>
        </div>
    )
} 

const MailSend = ({activeRoom, sendMail}) => {
    return(
        <div>
            <button onClick = {()=>sendMail("send-morse", null)}>Morse Mail Schicken</button>
        </div>
    )
}

const Preview= ({savedImage}) =>{
    if (savedImage===""){
    return(
        <div>
            Nimm zuerst ein Bild auf!
        </div>
    )}
    return(<div className="preview">
                    <img src={savedImage}/>
    </div>)
}

function PopUp({style, children }) {
  return createPortal(
    <div style={{
      ...style,
      background: "white",
      border: "1px solid #ccc",
      padding: "10px",
      zIndex: 9999,
    }}>
      {children}
    </div>,
    document.body
  );
}

const PicSend = ({activeRoom, sendMail, savedImage})=>{
    const itemRef = useRef();
    const [popUpStyle, setPopUpStyle]= useState({});
    const openPopUp = () =>{
        const rect = itemRef.current.getBoundingClientRect();
        const spaceRight = window.innerWidth - rect.right;
        const popupWidth = 200; // or measure dynamically

        let left;
        if (spaceRight > popupWidth) {
            left = rect.right;      // place on right
        } else {
            left = rect.left - popupWidth; // place on left
        }

        setPopUpStyle({
            top: rect.top,
            left,
            width: popupWidth,
            position: "absolute",
        });

    }
    
    const closePopUp = () =>{
        setPopUpStyle({});
    }

    const [showPreview, setShowPreview] = useState(false)
    
    return(
        <div ref={itemRef}
        onMouseEnter={()=>openPopUp()}
        onMouseLeave={()=>closePopUp()}
        >
            <button onClick = {()=>sendMail("send-pic", savedImage)}>Spycam Foto schicken</button>
            {popUpStyle.left !== undefined && (
                <PopUp style={popUpStyle}><Preview savedImage = {savedImage}/></PopUp>
)}
        </div>
    )
}

const SocketCommand = ({activeRoom, command, socketCommand}) => {
    return(
        <div>
            <button onClick = {()=>socketCommand(command.command)}>{command.text}</button>
        </div>
    )
}

const CommandButton = ({item}) =>{
    return(<div>{item}</div>)
    
}

const CommandSection = ({commands, activeRoom, socketCommand, sendMail, delMail, savedImage}) => {
    return(
        <div> 
            {commands.map((command)=>(
                
            <CommandButton
                item = { 
                    command.title == "MailSend" ?
                        <PicSend activeRoom ={activeRoom} sendMail ={sendMail} savedImage={savedImage}/>:
                    command.title == "MailDelete"?
                        <MailDelete activeRoom={activeRoom} delMail = {delMail}/>:
                    command.title == "SocketCommand"?
                        <SocketCommand activeRoom={activeRoom} command={command.props} socketCommand={socketCommand}/>:
                    null 
                }
            />))}
        </div>
    )
} 

export default CommandSection;