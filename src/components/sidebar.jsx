// Filename - components/Sidebar.js

import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import * as FaIcons from "react-icons/fa";
import * as AiIcons from "react-icons/ai";
import { IconContext } from "react-icons/lib";
import ChooseRoom from "./chooseRoom.jsx";

const Nav = styled.div`
    background: #15171c;
    height: 80px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
`;

const NavIcon = styled(Link)`
    margin-left: 2rem;
    font-size: 2rem;
    height: 80px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
`;

const SidebarNav = styled.nav`
    background: #15171c;
    width: 250px;
    height: 100vh;
    display: flex;
    justify-content: center;
    position: fixed;
    top: 0;
    left: ${({ sidebar }) => (sidebar ? "0" : "-100%")};
    transition: 350ms;
    z-index: 10;
`;

const SidebarWrap = styled.div`
    width: 100%;
`;

const Menus = [
 { title: "Presets", src: "Overview" },
 { title: "Add Widget", src: "Transactions" },
 { title: "Setting", src: "Settings" },
 ];

const PresetList = [
    {"title": "R14C"},
    {"title": "Buch7Siegel"},
    {"title": "Labor"}
]





const Presets = ({safePreset, getSettings, presets, setPresets, loadPreset, activeRoom}) => {
    
    const [displayPresets, setDisplayPresets] = useState([]);
    const getPresets = async() =>{
        let tempSettings = await getSettings('presets-load')
        console.log("the Presets that should be displayed:",tempSettings);
        setPresets(tempSettings);
    }

    useEffect(() =>{
        getPresets(); 
        setDisplayPresets(presets.filter((preset)=>{preset.room==activeRoom}))
    }, [])

    const [presName, setPresName] = useState("");
    const [selectTitle, setSelectTitle] = useState("");

    const handleChange = (e)=>{
        setPresName(e);
    }
    return (
        <div>   
            Preset Auswählen:
        <select name="presets" id="presets" defaultValue="hidden" onChange={(e) => setSelectTitle(e.target.value)}>
            <option disabled={true} value="hidden">Preset wählen</option>
            {presets.map(({title}) =>
            <option key = {title} value={title} >{title}</option>
            )}
        </select>
        <button onClick={()=>loadPreset(selectTitle)}>Preset Auswählen</button>

        <div>
        Preset Speichern als: 
        <input onChange = {(e) => setPresName(e.target.value)} type="text" id="presName" name="presName"/>
        <button onClick = {() => safePreset(presName)}>Safe</button> 
        </div>
        </div>
    )
} 



const AddWidget = ({widgetList, addItem}) => {
    const [selectWidget, setSelectWidget] = useState("")

    return(
        <div>
        <select name="presets" id="presets" defaultValue="hidden" onChange={(e) => setSelectWidget(e.target.value)}>
            <option disabled={true} value="hidden">Widget wählen</option>
            {widgetList.map(({title}) =>
            <option key = {title} value={title} >{title}</option>
            )}
        </select>
        <button onClick={()=>addItem({position: {i: 1,
                                                x: 0,
                                                y: 0,
                                                w: 2,
                                                h: 2,
                                                static: false,
                                                moved: false
                                                },
                                    title: selectWidget,
                                    settings: [] })}>Widget hinzufügen</button>
        </div>
    )
}

const Settings = () =>{

}

const AddCamera = ({saveSettings, activeRoom}) =>{
    const [camName, setCamName] = useState("");
    const [type, setType] = useState("");
    const [url, setUrl] = useState("");

    const saveCam = () => {
        saveSettings("cam-save", {
            "name": camName,
            "type": type,
            "url": saveUrl,
            "room": activeRoom
        })
    }

    return(
        <div>
        Camera Names: 
        <input onChange = {(e) => setCamName(e.target.value)} type="text" id="camname" name="camname" placeholder="Name"/>
        <input onChange = {(e) => setUrl(e.target.value)} type="url" id="url" name="url" placeholder = "url"/>

        <input onSelect={()=>setType("rtsp")} type="radio" id="rtsp" name="rtsp" value="rtsp"/>
        <label htmlFor="rtsp">rtsp</label>
        <input onSelect= {()=>setType("http")}type="radio" id="http" name="http" value="http"/>
        <label htmlFor="http">http</label>

        <button onClick = {() => saveCam()}>Save</button> 
        </div>
    )
}

const Sidebar = ({activeRoom, chooseRoom, rooms, setRooms, safePreset, getSettings, presets, setPresets, loadPreset, addItem, widgetList, saveSettings}) => {
    const [open, setOpen] = useState(false);


    //const setOpen = () => setSidebar(!sidebar);
    if (open){
    return (
        <div className= "flex" >
            <div className={` ${open ? "w-72" : "w-0 "} bg-white h-screen p-5 pt-8 duration-300 sidebar`}>

                <img
                    src="../app/favicon.ico"
                    className={`absolute cursor-pointer -right-0 top-5 w-7 border-dark-purple
                    border-2 rounded-full ${!open && "rotate-180"}`}
                    onClick={() => setOpen(!open)}
                    />

            Aktiver Raum: {activeRoom}
            <ul className="pt-6">
            <li>Choose Room
            <ChooseRoom getSettings ={getSettings} rooms={rooms} setRooms = {setRooms} chooseRoom = {chooseRoom}/>
            </li>
            <li>Presets 
            <Presets activeRoom ={activeRoom} getSettings={getSettings} safePreset={safePreset} presets = {presets} setPresets = {setPresets} loadPreset={loadPreset}/>
            </li>
            <li>Add Widget</li>
                <AddWidget addItem = {addItem} widgetList = {widgetList}/>
            <li>Add Camera</li>
                <AddCamera saveSettings = {saveSettings} activeRoom = {activeRoom}/>
            <li>Settings</li> 
            </ul>
            </div>
        {/* … (code for sidebar structure) */}
        </div>
);
}
return(
    <div><img
                    src="../app/favicon.ico"
                    className={`fixed cursor-pointer -right-0 top-5 w-7 border-dark-purple
                    border-2 rounded-full ${!open && "rotate-180"}`}
                    onClick={() => setOpen(!open)}
                    />
                    </div>
);
}
export default Sidebar;