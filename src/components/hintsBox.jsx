"use client"


import React from 'react'
import {useEffect, useState} from 'react'


const HintsBox = ({hints, id, changed}) => {
  const [displayHints, setDisplayHints] = useState(hints[0])

  useEffect(() => {
        setDisplayHints(hints[id]);
        console.log(displayHints);
      }, [changed]);

    return (
        <div>
            <p>{displayHints.hint}</p>
        </div>
    )
}

export default HintsBox