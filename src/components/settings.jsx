"use client"


import React from 'react'
import {useEffect, useState} from 'react'


const Settings = ({getSettings, saveSettings}) => {
  
  
  const [settings, setSettings] =useState([
    {"name": "R14C",
     "defWidgets": ["Timer", "Camera"],

    }
    ,{"name": "Z-Immun",
      "defWidgets": ["Chat", "Camera", "Controls"]
    }]
  )

  const [displaySettings, setDisplaySettings] = useState([])

  const changeSettings= async() => {
    const tempSettings = await getSettings('settings-load')
    console.log("the settings that should be displayed:",tempSettings);

    setDisplaySettings(tempSettings);

    };
    
  

  //const [displayHints, setDisplayHints] = useState(hints[id]);
  useEffect(() => {
    console.log("The settings that are to be displayed: ",displaySettings);
  }, [displaySettings]);

    return (
        <div>
          <div>
            <button onClick = {() => saveSettings('settings-save', settings)}>Save Settings</button>
         </div>
         <div>
            <button onClick = {() => changeSettings()}>Display Settings</button> 
         </div>   
            <div>{displaySettings.map(({name})=> <div>{name}</div>)}</div>
        </div>
    )
}

export default Settings