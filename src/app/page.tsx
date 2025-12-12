"use client"

import './globals.css'

import React from 'react'
import CheckboxList from '../components/checkbox.jsx'
import HintsBox from '../components/hintsBox.jsx'
import CountdownTimer from '../components/timer.jsx'
import VidSection from '../components/cameraSection.jsx'
import GridItem from '../components/gridItem.jsx'
import Sidebar from "../components/sidebar.jsx"
import Settings from "../components/settings.jsx"
import ChatBox from "../components/chat.jsx"
import widgetList from "../components/widgetList.jsx"
import MailControl from "../components/mail.jsx"
import ChooseRoom from "../components/chooseRoom.jsx"
import CommandSection from "../components/controls.jsx"

import { socket } from "../socket";

import { useCallback, useEffect, useState } from "react";
import GridLayout, { Layout } from "react-grid-layout";

import { v4 as uuidv4 } from 'uuid';
let uuid = uuidv4(); 

import "./ReportsGridResizeHandle.css";
import { Responsive, WidthProvider } from 'react-grid-layout';
//import GridItem from './GridItem';

import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import {
  UseResizeReturn,
  Widget,
  WidgetCardProps,
  WidgetOnLayout,
} from "../components/types";

const ResponsiveGridLayout = WidthProvider(Responsive) as any;

// Custom hook to handle responsive resizing of the grid container
const useResize = (): UseResizeReturn => {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    // Get the main container element
    const reportsElement = document.getElementById("reports");

    // Update dimensions when container size changes
    const handleResize = () => {
      if (!reportsElement) return;
      setDimensions({
        width: reportsElement.offsetWidth,
        height: reportsElement.offsetHeight,
      });
    };

    // Use ResizeObserver to watch for container size changes
    const resizeObserver = new ResizeObserver(handleResize);
    if (reportsElement) {
      resizeObserver.observe(reportsElement);
    }

    // Cleanup observer on unmount
    return () => resizeObserver.disconnect();
  }, []);

  // Calculate the height of each grid box accounting for gaps
  const totalGapHeight = (GRID_CONFIG.MAX_ROWS - 1) * GRID_CONFIG.GAP;
  const boxHeight = (dimensions.height - totalGapHeight) / GRID_CONFIG.MAX_ROWS;

  return { wrapperWidth: dimensions.width, height: boxHeight };
};

// Header component for each widget with drag handle
const HeaderItem = ({ title }: { title: string }) => (
  <div className="px-4 py-2 flex cursor-grab items-center justify-between border-b border-silver">
    <div className="draggable-handle text-back font-semibold flex-1">
      {title}
    </div>
  </div>
);

// Sample widget content component showing a large number
  
const Timer = () => (
  <div className = "wrapper">
        <CountdownTimer/>
      </div>
);


// Container component for widgets with drag functionality
const WidgetCard = ({
  children,
  className = "",
  draggable,
  onDragStart,
}: WidgetCardProps) => (
  <div
    className={`rounded-sm flex flex-col border border-silver bg-yellow-500 ${className}`}
    draggable={draggable}
    onDragStart={onDragStart}
  >
    {children}
  </div>
);

// Grid configuration constants
const GRID_CONFIG = {
  COLS: 10,
  MAX_ROWS: 10,
  GAP: 20,
} as const;

export default function App() {

  const [isConnected, setIsConnected] = useState(false);
  const [transport, setTransport] = useState("N/A");

  const [genSettings, setgenSettings] = useState([]);
  const [camSettings, setCamSettings] = useState([]);

  const [rooms, setRooms] = useState([]);
  const [activeRoom, setActiveRoom] = useState("undefined");
  const [username, setUsername] = useState("controller");

  const [commands, setCommands]= useState([])

  const [savedImage, setSavedImage] = useState("");

  const [hints, setHints] = useState([
    {"id": 0, 
        "text": "Test1",
        "hint": "Hint1",
        "display": false}, 
    {"id": 1,
        "text": "Test2",
        "hint": "Hint2",
        "display": false},
    {"id":2,
        "text": "Test3",
        "hint": "Hint3",
        "display": false}]);

  const [defWidgets, setDefWidgets] = useState([
    {
    position: {"i": "4044",
    "w": 3,
    "h": 3,
    "x": 4,
    "y": 5,
    "moved": false,
    "static": false},
    title: "ChooseRoom",
    default: true,
    settings: []
  }

  ]);

  

  const [chatLog, setChatLog] = useState([{
    text:"test",
    username: "controller",
    time: "1234"
    
  }]);

  const newMessage = (msg) => {
    setChatLog((prevChatLog) => [
      ...prevChatLog, msg
    ])
  };

  const [user, setUser] = useState({
    room: "R14C",
    username: "controller",
    id: "0"
  })

  useEffect(() => {
    if (socket.connected) {
      onConnect();
    }

    function onConnect() {
      setIsConnected(true);
      setTransport(socket.io.engine.transport.name);
      socket.emit('joinRoom', user);
      socket.io.engine.on("upgrade", (transport) => {
        setTransport(transport.name);
      });
    }

    function onDisconnect() {
      setIsConnected(false);
      setTransport("N/A");
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
    };
  }, []);

  const getSettings = (type) => {
    return new Promise ((resolve) => {
      socket.emit(type);
      socket.on(`settingLog:${type}`, (settings) => {
      //console.log("settings:", settings)
      resolve(settings);
    });
    })  
  };

  const chooseRoom = async (roomName) =>{
    //const tempSettings = await getSettings('settings-load')
    const tempRoom = rooms.find(room => room.name == roomName)
    setHints(tempRoom.hints);
    setDefWidgets(tempRoom.defWidgets);
    setActiveRoom(tempRoom.name);
    setCommands(tempRoom.commands);
  }


  const delMail = () =>{
    socket.emit("mail-reset", (activeRoom))
  }

  const sendMail = (command, attachment) => {
    socket.emit(command, ({"activeRoom": activeRoom, "attachment": attachment}))
  };

  const saveSettings = (type, settings) => {
    socket.emit(type, (settings));
    console.log(settings);
  };

  const sendMessage = (newText) => {
    const msg = {text: newText,
                            username: "player",
                            time: 123
      }
    socket.emit("Message", (msg))  ;
    console.log("message is beeing sent: ", msg);
    newMessage(msg);
  }

  socket.on("Message", (msg) => {
    newMessage(msg);
    console.log(msg);
  });

  const socketCommand = (command, activeRoom) =>{
    socket.emit(command, (activeRoom))
  }

 






  
  const [newCounter, setNewCounter] = useState(1)
  const [changedDisplay, setChangedDisplay] =useState(true);
  const [activeHint, setActiveHint] = useState(0);
  const [urls, setUrls] = useState(["", "http://192.168.6.2:8083/stream/Z-immun/channel/0/webrtc"])
  const[resize, setResize]=useState(false);
  
  const [items, setItems] = useState([]);

useEffect(()=> {
    setItems(defWidgets);
  },[defWidgets])

  const addItem = (newItem) =>{
    let item = newItem
    item.position.i = "n"+newCounter
    const newItems = items.concat(item
    );
    setItems(newItems);
    //const count = newCounter;
    setNewCounter((prevCounter)=>prevCounter+1)
  }
  
  const removeItem = (itemId) => {
    let newItems = items.filter((item) => item.position.i != itemId);
    setItems(newItems);
  }

  const [layout, setLayout] = useState(items)

  const handleDragAndResize = useCallback((layout, oldItem, newItem) => {
    
    setLayout(layout);
    setResize((prevState)=>!prevState)
  }, []);

  const [presets, setPresets]= useState([]);

  const safePreset = (presName) =>{
    let tempLayout = []
    items.map(({title}, index)=> {
      //console.log(layout[index])
      //console.log(layout[index].position)
      tempLayout.push({
        "position": layout[index],
        "title": title
      })
    })
    const newEl = {"title": presName,
                   "room": activeRoom,
                  "layout": tempLayout
                  
                                    
    }
    saveSettings("preset-save", [...presets, newEl])
    setPresets((prevPresets)=>[...prevPresets, newEl])
}



const loadPreset = (presName) => {
  console.log("title we are searching", presName)
  let tempItems = presets.find(o => o.title == presName);
  setItems(tempItems.layout)
}

  return (
    <div className = ''>
    
    <ResponsiveGridLayout
      breakpoints={{ md: 960, sm: 720 }}
      cols={{ md: 10, sm: 8 }}
      rowHeight={60}
      layouts={{md: items.map((widget) =>widget.position),
               sm: items.map((widget) =>widget.position)}}
      onDragStop={handleDragAndResize}
      onResizeStop={handleDragAndResize}
      draggableHandle=".draggable-handle"
      resizeHandles={["s", "e", "w","n","sw","se","nw","ne"]}
      preventCollision={true}
      compactType={null}
      autosize= {true}
      margin = {[5,5]}

    >
      {items.map((item) => (
        <div key={item.position.i}>
                    
          <GridItem 
                item = {
                      item.title === "Hints" ?
                        <HintsBox hints={hints} id={activeHint} /> :
                      item.title === "Progress" ?
                        <CheckboxList hints={hints} progCheck={setActiveHint} /> :
                      item.title === "Spielzeit" ?
                        <Timer /> :
                      item.title === "div" ?
                        <div>{item.title}</div>:
                      item.title === "Chat" ?
                        <ChatBox chatLog = {chatLog} sendMessage= {sendMessage} resize = {resize}/>:
                      item.title === "Settings" ?
                        <div><Settings getSettings = {getSettings} saveSettings = {saveSettings}/></div>:
                      item.title === "Mails" ?
                        <div><MailControl sendMail = {sendMail} delMail = {delMail}/></div>:
                      item.title === "VidSection" ?
                        <div><VidSection getSettings = {getSettings} setSavedImage={setSavedImage}/></div>:
                      item.title === "Commands" ?
                        <div><CommandSection  savedImage = {savedImage} commands = {commands} activeRoom = {activeRoom} socketCommand={socketCommand} sendMail = {sendMail} delMail = {delMail}/></div>:
                      item.title ==="ChooseRoom" ?
                        <div><ChooseRoom getSettings ={getSettings} setRooms ={setRooms} rooms = {rooms} chooseRoom = {chooseRoom}/></div>:
                      item.title === "SocketInfo" ? 
                        <div>
                        <p>Status: { isConnected ? "connected" : "disconnected" }</p>
                        <p>Transport: { transport }</p>
                        </div> :null}
               header = {item.title} 
               id = {item.position.i}
               removeItem = {removeItem}
               def = {item.default}/>
        </div>
      ))}
    </ResponsiveGridLayout>

    <Sidebar saveSettings = {saveSettings} activeRoom = {activeRoom} rooms = {rooms} chooseRoom = {chooseRoom} setRooms ={setRooms} widgetList = {widgetList} addItem = {addItem} getSettings={getSettings} safePreset={safePreset} presets = {presets} setPresets = {setPresets} loadPreset={loadPreset}/>
    </div>
  );
}