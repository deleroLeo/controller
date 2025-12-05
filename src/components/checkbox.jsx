"use client"

import React from 'react'
import { useCallback, useEffect, useState } from "react";

const Checkbox = ({task, id, progCheck}) => {
    return (
        <div>
            <label>
                <input type="checkbox" className = "prog-check" onClick={() => progCheck(id)} />
                {task}
                
            </label>
        </div>
    )
}

const CheckboxList = ({hints, progCheck }) => {
    return(
    <div className="flex h-full flex-col items-center justify-center">
    {hints.map(({id, text}) => 
            <Checkbox key = {id} task = {text} id = {id} progCheck={progCheck} />
        )}
    </div>)
}

export default CheckboxList