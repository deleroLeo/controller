"use client"


import React from 'react'
import {useEffect, useState} from 'react'


const ChooseRoom = ({getSettings, setRooms, rooms, chooseRoom}) => {
    const [selectRoom, setSelectRoom] = useState("");

    const getRooms = async () =>{
        const tempSettings = await getSettings('settings-load');
        setRooms(tempSettings);
        
    }

    useEffect(()=> {
        getRooms();
    },[])

    return(
        <div>
            <select name="rooms" id="rooms" onChange={(e) => setSelectRoom(e.target.value)}>
            {rooms.map(({name}) =>
            <option key = {name} value={name} >{name}</option>
            )}
            </select>
            <button onClick={()=>chooseRoom(selectRoom)}>Raum Auswählen</button>
        </div>
    )

}
export default ChooseRoom