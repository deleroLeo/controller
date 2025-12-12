"use client"
import {useRef, useState, useEffect} from 'react'
import {HeightContext} from "./Contexts/heightContext.jsx"

const GridItem = ({item, header, id, def, removeItem}) => {
  const itemRef = useRef();
  const [height, setHeight] = useState(0);
  
  const getHeight = () =>{
        const rect = itemRef.current.getBoundingClientRect();
        const h = rect.height//rect.bottom-rect.top
        return(h)
    }
  useEffect(() => {
    if (!itemRef.current) return;

    const observer = new ResizeObserver(() => {
      const rect = itemRef.current.getBoundingClientRect();
      setHeight(rect.height);
    });
    observer.observe(itemRef.current);  
    return () => observer.disconnect();
  }, []);


  if (!def){
    return(
    <div  className="status-section h-full ">
    <div className="cursor-grab section-head">
    <div className="draggable-handle">
      {header}
      
    </div>
    <div><button className = "delete-Item" onClick={()=>removeItem(id)}> X </button></div>

    </div>
    <div ref = {itemRef} style={{ height: "100%", width: "100%" }}>
      <HeightContext.Provider value={height}>
        {item}
      </HeightContext.Provider>
    </div>
    </div> 
    )}
  if (def){
    return(
    <div  className="status-section h-full">
    <div className="cursor-grab section-head">
    <div className="draggable-handle ">
      {header}
    </div>
    </div>
    <div ref = {itemRef} style={{ height: "100%", width: "100%" }}>
      <HeightContext.Provider value={height}>
        {item}
      </HeightContext.Provider>
    </div>
    </div> 
    )
  }
  
}

export default GridItem