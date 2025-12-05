// Filename - components/Sidebar.js

import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import * as FaIcons from "react-icons/fa";
import * as AiIcons from "react-icons/ai";
import { IconContext } from "react-icons/lib";

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





const Presets = ({safePreset, getSettings, presets, setPresets, loadPreset}) => {
    

    const getPresets = async() =>{
        const tempSettings = await getSettings('presets-load')
        console.log("the settings that should be displayed:",tempSettings);
        setPresets(tempSettings);
    }

    useEffect(() =>{
        getPresets();
    }, [])

    const [presName, setPresName] = useState("");
    const [selectTitle, setSelectTitle] = useState("");

    const handleChange = (e)=>{
        setPresName(e);
    }
    return (
        <div>   
            Preset Auswählen:
        <select name="presets" id="presets" onChange={(e) => setSelectTitle(e.target.value)}>
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
        <select name="presets" id="presets" onChange={(e) => setSelectWidget(e.target.value)}>
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

const Sidebar = ({safePreset, getSettings, presets, setPresets, loadPreset, addItem, widgetList}) => {
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

            
            <ul className="pt-6">
            <li>Presets 
            <Presets getSettings={getSettings} safePreset={safePreset} presets = {presets} setPresets = {setPresets} loadPreset={loadPreset}/>
            </li>
            <li>Add Widget</li>
                <AddWidget addItem = {addItem} widgetList = {widgetList}/>
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