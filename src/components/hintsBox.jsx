"use client"


import React from 'react'
import {useEffect, useState} from 'react'


const HintsBox = ({hints, id}) => {
  const [displayHints, setDisplayHints] = useState(hints[id]);
  //console.log(displayHints);
  useEffect(() => {
        setDisplayHints(hints[id]);
        console.log(displayHints);
      }, [id]);

    return (
        <div>
            <p>{displayHints.hint}</p>
        </div>
    )
}

export default HintsBox